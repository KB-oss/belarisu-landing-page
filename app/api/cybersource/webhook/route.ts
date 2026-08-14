// app/api/cybersource/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { compactDecrypt } from 'jose';
import fs from 'fs';
import path from 'path';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type JsonRecord = Record<string, unknown>;

function logWebhook(label: string, value?: unknown) {
    if (value === undefined) {
        console.log(`[CyberSource Webhook] ${label}`);
        return;
    }

    console.log(`[CyberSource Webhook] ${label}:`, value);
}

function logWebhookError(label: string, error: unknown) {
    console.error(`[CyberSource Webhook] ${label}:`, error);
    if (error instanceof Error && error.stack) {
        console.error(`[CyberSource Webhook] ${label} stack:`, error.stack);
    }
}

function mask(value: string | null | undefined): string | null {
    if (!value) return null;
    if (value.length <= 12) return `${value.slice(0, 2)}...${value.slice(-2)}`;
    return `${value.slice(0, 6)}...${value.slice(-6)}`;
}

function headersForLogs(headers: Headers): Record<string, string> {
    const sensitiveHeaderNames = new Set([
        'authorization',
        'cookie',
        'set-cookie',
        'v-c-signature',
        'signature',
        'x-signature',
    ]);

    return Object.fromEntries(
        [...headers.entries()].map(([key, value]) => [
            key,
            sensitiveHeaderNames.has(key.toLowerCase()) ? mask(value) || '[redacted]' : value,
        ])
    );
}

function jsonForLogs(value: unknown): string {
    try {
        return JSON.stringify(value, null, 2);
    } catch {
        return '[unserializable value]';
    }
}

function payloadPreview(value: string, maxChars = 2000): string {
    return value.length > maxChars ? `${value.slice(0, maxChars)}...[truncated ${value.length - maxChars} chars]` : value;
}

function asRecord(value: unknown): JsonRecord | null {
    return value && typeof value === 'object' && !Array.isArray(value) ? value as JsonRecord : null;
}

function getRecordProperty(value: unknown, key: string): JsonRecord | null {
    return asRecord(asRecord(value)?.[key]);
}

function getStringProperty(value: unknown, key: string): string | null {
    const property = asRecord(value)?.[key];
    return typeof property === 'string' ? property : null;
}

function verifyDigitalSignature(
    rawBody: string,
    signatureHeader: string | null,
    expectedKeyId: string | undefined,
    secretBase64: string | undefined
): boolean {
    if (!expectedKeyId || !secretBase64) {
        logWebhookError('Missing digital signature env vars', {
            hasWebhookKeyId: Boolean(expectedKeyId),
            hasWebhookSecret: Boolean(secretBase64),
        });
        return false;
    }

    if (!signatureHeader) {
        logWebhook('No v-c-signature header found');
        return false;
    }

    try {
        const cleaned = signatureHeader.replace(/^v-c-signature:\s*/i, '').trim();
        logWebhook('v-c-signature header received', {
            length: cleaned.length,
            preview: mask(cleaned),
        });

        const parts = Object.fromEntries(
            cleaned.split(';').map((part) => {
                const idx = part.indexOf('=');
                return [part.slice(0, idx).trim(), part.slice(idx + 1).trim()];
            })
        );

        const { t: timestamp, keyId: receivedKeyId, sig: receivedSignature } = parts;
        logWebhook('parsed signature header', {
            timestamp,
            receivedKeyId,
            expectedKeyId,
            receivedSignatureLength: receivedSignature?.length || 0,
            receivedSignaturePreview: mask(receivedSignature),
        });

        if (!timestamp || !receivedKeyId || !receivedSignature) {
            logWebhook('Missing t / keyId / sig in v-c-signature header', parts);
            return false;
        }

        if (receivedKeyId !== expectedKeyId) {
            logWebhookError('Webhook key ID mismatch', { receivedKeyId, expectedKeyId });
            return false;
        }

        const messageToSign = `${timestamp}.${rawBody}`;
        const expectedSignature = crypto
            .createHmac('sha256', Buffer.from(secretBase64, 'base64'))
            .update(messageToSign)
            .digest('base64');

        const receivedBuf = Buffer.from(receivedSignature, 'base64');
        const expectedBuf = Buffer.from(expectedSignature, 'base64');
        logWebhook('signature comparison details', {
            rawBodyLength: rawBody.length,
            messageToSignLength: messageToSign.length,
            receivedBytes: receivedBuf.length,
            expectedBytes: expectedBuf.length,
            expectedSignaturePreview: mask(expectedSignature),
        });

        if (receivedBuf.length !== expectedBuf.length) {
            logWebhookError('Webhook signature length mismatch', {
                receivedBytes: receivedBuf.length,
                expectedBytes: expectedBuf.length,
            });
            return false;
        }

        const isValid = crypto.timingSafeEqual(receivedBuf, expectedBuf);
        logWebhook(isValid ? 'Digital signature verified' : 'Invalid digital signature');
        return isValid;
    } catch (error) {
        logWebhookError('Signature verification error', error);
        return false;
    }
}

async function decryptPayload(encryptedPayload: string): Promise<unknown> {
    const privateKeyPath = path.join(process.cwd(), 'secrets', 'request_private.pem');
    const privateKeyPem = process.env.CYBERSOURCE_MLE_PRIVATE_KEY
        ? process.env.CYBERSOURCE_MLE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : fs.existsSync(privateKeyPath)
            ? fs.readFileSync(privateKeyPath, 'utf8')
            : null;

    if (!privateKeyPem) {
        throw new Error('Missing CYBERSOURCE_MLE_PRIVATE_KEY or secrets/request_private.pem');
    }

    logWebhook('MLE private key source', {
        fromEnv: Boolean(process.env.CYBERSOURCE_MLE_PRIVATE_KEY),
        fromFile: !process.env.CYBERSOURCE_MLE_PRIVATE_KEY && fs.existsSync(privateKeyPath),
        keyLength: privateKeyPem.length,
        keyPreview: mask(privateKeyPem.replace(/\s+/g, '')),
    });

    const privateKey = crypto.createPrivateKey(privateKeyPem);
    const jwe = encryptedPayload.replace(/^\{[^}]*\}/, '');
    const jweParts = jwe.split('.');
    logWebhook('encrypted payload details', {
        originalLength: encryptedPayload.length,
        jweLength: jwe.length,
        jwePartCount: jweParts.length,
        jwePartLengths: jweParts.map((part) => part.length),
        jwePreview: mask(jwe),
    });

    const { plaintext } = await compactDecrypt(jwe, privateKey);
    logWebhook('MLE decrypt succeeded', {
        plaintextBytes: plaintext.byteLength,
    });

    return JSON.parse(Buffer.from(plaintext).toString('utf8'));
}

export async function GET() {
    logWebhook('GET health check received', {
        timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
        {
            status: 'ok',
            message: 'Webhook is healthy',
            timestamp: new Date().toISOString(),
        },
        {
            status: 200,
            headers: {
                'ngrok-skip-browser-warning': 'true',
            },
        }
    );
}

export async function POST(req: NextRequest) {
    const startedAt = Date.now();
    const requestId = crypto.randomUUID();

    logWebhook('POST received', {
        requestId,
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        headers: headersForLogs(req.headers),
        env: {
            hasWebhookKeyId: Boolean(process.env.CYBERSOURCE_WEBHOOK_KEY_ID),
            webhookKeyId: process.env.CYBERSOURCE_WEBHOOK_KEY_ID || null,
            hasWebhookSecret: Boolean(process.env.CYBERSOURCE_WEBHOOK_SECRET),
            webhookSecretLength: process.env.CYBERSOURCE_WEBHOOK_SECRET?.length || 0,
            hasMlePrivateKey: Boolean(process.env.CYBERSOURCE_MLE_PRIVATE_KEY),
            mlePrivateKeyLength: process.env.CYBERSOURCE_MLE_PRIVATE_KEY?.length || 0,
        },
    });

    const rawBody = await req.text();
    logWebhook('raw body received', {
        requestId,
        length: rawBody.length,
        preview: payloadPreview(rawBody),
    });

    if (!rawBody) {
        logWebhook('empty body response', { requestId, durationMs: Date.now() - startedAt });
        return NextResponse.json({ received: true }, { status: 200 });
    }

    const isValid = verifyDigitalSignature(
        rawBody,
        req.headers.get('v-c-signature'),
        process.env.CYBERSOURCE_WEBHOOK_KEY_ID,
        process.env.CYBERSOURCE_WEBHOOK_SECRET
    );

    if (!isValid) {
        logWebhookError('Signature failed verification. Inspect before trusting payload.', { requestId });
    }

    let outer: unknown;
    try {
        outer = JSON.parse(rawBody);
        logWebhook('outer JSON parsed', {
            requestId,
            type: Array.isArray(outer) ? 'array' : typeof outer,
            keys: Object.keys(asRecord(outer) || {}),
            json: jsonForLogs(outer),
        });
    } catch (error) {
        logWebhookError('Failed to parse outer webhook JSON', error);
        return NextResponse.json({ received: true }, { status: 200 });
    }

    const outerRecord = asRecord(outer);
    const payload = outerRecord?.payload;
    const testMessage = getStringProperty(payload, 'message');
    logWebhook('payload inspection', {
        requestId,
        eventType: outerRecord?.eventType,
        payloadType: Array.isArray(payload) ? 'array' : typeof payload,
        payloadKeys: Object.keys(asRecord(payload) || {}),
        isEncryptedStringPayload: typeof payload === 'string',
        encryptedPayloadPreview: typeof payload === 'string' ? mask(payload) : null,
        encryptedPayloadLength: typeof payload === 'string' ? payload.length : 0,
        hasTestMessage: Boolean(testMessage),
    });

    if (testMessage) {
        logWebhook('CyberSource test webhook', { requestId, testMessage });
        return NextResponse.json({ received: true, test: true }, { status: 200 });
    }

    let decryptedPayload: unknown = null;
    if (typeof payload === 'string') {
        try {
            logWebhook('starting MLE decrypt', { requestId });
            decryptedPayload = await decryptPayload(payload);
            logWebhook('decrypted payload JSON', {
                requestId,
                type: Array.isArray(decryptedPayload) ? 'array' : typeof decryptedPayload,
                keys: Object.keys(asRecord(decryptedPayload) || {}),
                json: jsonForLogs(decryptedPayload),
            });
        } catch (error) {
            logWebhookError('MLE decryption failed', error);
            return NextResponse.json({ received: true, decryptionError: true }, { status: 200 });
        }
    } else {
        decryptedPayload = payload ?? outer;
        logWebhook('using unencrypted payload', {
            requestId,
            type: Array.isArray(decryptedPayload) ? 'array' : typeof decryptedPayload,
            keys: Object.keys(asRecord(decryptedPayload) || {}),
            json: jsonForLogs(decryptedPayload),
        });
    }

function normalizeStatus(rawStatus: string | null): string {
    if (!rawStatus) return 'pending';
    const s = rawStatus.toUpperCase();
    if (['AUTHORIZED', 'CAPTURED', 'SUCCESS', 'COMPLETED', 'ACCEPTED', 'DECISION_ACCEPT', 'TRANSACTION_APPROVED'].includes(s)) {
        return 'completed';
    }
    if (['DECLINED', 'REJECTED', 'FAILED', 'ERROR', 'DECISION_REJECT', 'TRANSACTION_DECLINED'].includes(s)) {
        return 'failed';
    }
    return rawStatus.toLowerCase();
}

    const orderInformation = getRecordProperty(decryptedPayload, 'orderInformation');
    const details = getRecordProperty(decryptedPayload, 'details');
    const processorInformation = getRecordProperty(details, 'processorInformation');
    const transactionId =
        getStringProperty(decryptedPayload, 'id') ||
        getStringProperty(orderInformation, 'transactionId') ||
        getStringProperty(processorInformation, 'transactionId');
    const status = getStringProperty(decryptedPayload, 'status') || getStringProperty(decryptedPayload, 'outcome');

    logWebhook('extracted result', {
        requestId,
        eventType: outerRecord?.eventType,
        transactionId,
        status,
        durationMs: Date.now() - startedAt,
    });

    if (transactionId) {
        const normalizedStatus = normalizeStatus(status);
        try {
            const supabase = createAdminClient();
            const { error: dbError } = await supabase
                .from('cybersource_transactions')
                .upsert(
                    {
                        transaction_id: transactionId,
                        status: normalizedStatus,
                        error_code: normalizedStatus === 'failed' ? status : null,
                        error_message: normalizedStatus === 'failed' ? `CyberSource status: ${status}` : null,
                        cybersource_response: decryptedPayload || outer,
                        updated_at: new Date().toISOString(),
                    },
                    { onConflict: 'transaction_id' }
                );

            if (dbError) {
                logWebhookError('Failed to update Supabase transaction', dbError);
            } else {
                logWebhook('Successfully updated Supabase transaction', { transactionId, normalizedStatus });
            }
        } catch (dbErr) {
            logWebhookError('Supabase client error', dbErr);
        }
    }

    const responseBody = { received: true, transactionId: transactionId || null, status: status || null };
    logWebhook('response sent', { requestId, statusCode: 200, body: responseBody });

    return NextResponse.json(responseBody, { status: 200 });
}

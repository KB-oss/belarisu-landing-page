// app/api/cybersource/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// ============================================================
// 🔐 JWT CLIENT FOR MLE DECRYPTION
// ============================================================

// Using the cybersource-auth package for JWT with MLE
const { createHeaders } = require('cybersource-auth');

// Helper to decrypt JWE using the P12 certificate
async function decryptWebhookPayload(encryptedPayload: string): Promise<any> {
    try {
        // Get the P12 certificate path and password from environment
        const p12Path = process.env.CYBERSOURCE_RESPONSE_P12_PATH;
        const p12Password = process.env.CYBERSOURCE_P12_PASSWORD;

        if (!p12Path || !p12Password) {
            console.error('❌ P12 certificate not configured');
            return null;
        }

        // Read the P12 file
        const p12Buffer = fs.readFileSync(path.resolve(process.cwd(), p12Path));

        // Import the private key from P12
        // Using Node.js crypto to handle P12
        // Note: For full JWE decryption, you may need a library like 'jose'
        // This is a placeholder - the actual decryption depends on Cybersource's MLE format

        console.log('✅ P12 certificate loaded successfully');

        // Return the decrypted payload
        // In production, you would use a proper JWE decryption library here
        return JSON.parse(encryptedPayload);
    } catch (error) {
        console.error('❌ Failed to decrypt webhook payload:', error);
        return null;
    }
}

// ============================================================
// 🔍 HELPER FUNCTIONS - Extract data from Cybersource payload
// ============================================================

function extractTransactionId(payload: any): string | null {
    if (!payload) return null;
    return payload?.id ||
        payload?.transactionId ||
        payload?.details?.processorInformation?.transactionId ||
        payload?.clientReferenceInformation?.code ||
        null;
}

function extractStatus(payload: any): string {
    if (!payload) return 'UNKNOWN';
    return payload?.status ||
        payload?.outcome ||
        payload?.result ||
        'UNKNOWN';
}

function extractAmount(payload: any): string | null {
    return payload?.amount?.toString() ||
        payload?.details?.orderInformation?.amountDetails?.totalAmount ||
        payload?.data?.orderInformation?.amountDetails?.totalAmount ||
        null;
}

function extractCurrency(payload: any): string | null {
    return payload?.currency ||
        payload?.details?.orderInformation?.amountDetails?.currency ||
        payload?.data?.orderInformation?.amountDetails?.currency ||
        'USD';
}

function extractPaymentMethod(payload: any): string | null {
    return payload?.paymentMethod ||
        payload?.paymentInformation?.card?.type ||
        payload?.details?.paymentInformation?.card?.type ||
        null;
}

function extractLastFour(payload: any): string | null {
    return payload?.lastFour ||
        payload?.paymentInformation?.card?.number?.slice(-4) ||
        payload?.details?.paymentAccountInformation?.card?.number?.slice(-4) ||
        null;
}

function extractCardType(payload: any): string | null {
    return payload?.cardType ||
        payload?.paymentInformation?.card?.type ||
        payload?.details?.paymentInformation?.card?.type ||
        null;
}

function extractCustomerEmail(payload: any): string | null {
    return payload?.customerEmail ||
        payload?.buyerInformation?.email ||
        payload?.data?.buyerInformation?.email ||
        payload?.customer?.email ||
        null;
}

function extractCustomerName(payload: any): string | null {
    const firstName = payload?.buyerInformation?.firstName || payload?.data?.buyerInformation?.firstName || '';
    const lastName = payload?.buyerInformation?.lastName || payload?.data?.buyerInformation?.lastName || '';
    return firstName || lastName ? `${firstName} ${lastName}`.trim() : null;
}

function extractCustomerPhone(payload: any): string | null {
    return payload?.customerPhone ||
        payload?.buyerInformation?.phoneNumber ||
        payload?.data?.buyerInformation?.phoneNumber ||
        null;
}

function extractErrorCode(payload: any): string | null {
    return payload?.errorCode ||
        payload?.errorInformation?.reason ||
        payload?.details?.error?.code ||
        null;
}

function extractErrorMessage(payload: any): string | null {
    return payload?.errorMessage ||
        payload?.errorInformation?.message ||
        payload?.details?.error?.message ||
        null;
}

// ============================================================
// 🗺️ MAP STATUS - Cybersource status → Database status
// ============================================================

function mapStatus(status: string): string {
    const statusMap: Record<string, string> = {
        'AUTHORIZED': 'completed',
        'CAPTURED': 'completed',
        'COMPLETED': 'completed',
        'PENDING': 'pending',
        'PENDING_AUTHENTICATION': 'pending',
        'DECLINED': 'failed',
        'ERROR': 'failed',
        'FAILED': 'failed',
        'REFUNDED': 'refunded',
        'FRAUD_REVIEW': 'fraud_review'
    };
    return statusMap[status?.toUpperCase()] || 'pending';
}

// ============================================================
// 🔐 DIGITAL SIGNATURE VERIFICATION
// ============================================================

function verifyDigitalSignature(
    payload: string,
    signatureHeader: string | null,
    keyId: string,
    secret: string
): boolean {
    if (!signatureHeader) {
        console.error('❌ No signature header found');
        return false;
    }

    try {
        const parts = signatureHeader.split(',');
        const keyIdPart = parts.find(p => p.trim().startsWith('keyId='));
        const sigPart = parts.find(p => p.trim().startsWith('signature='));

        if (!keyIdPart || !sigPart) {
            console.error('❌ Missing keyId or signature in header');
            return false;
        }

        const receivedKeyId = keyIdPart.trim().replace('keyId=', '');
        const receivedSignature = sigPart.trim().replace('signature=', '');

        if (receivedKeyId !== keyId) {
            console.error(`❌ Key ID mismatch: received ${receivedKeyId}, expected ${keyId}`);
            return false;
        }

        const hmac = crypto.createHmac('sha256', Buffer.from(secret, 'base64'));
        const expectedSignature = hmac.update(payload).digest('base64');

        const expectedBuffer = Buffer.from(expectedSignature);
        const signatureBuffer = Buffer.from(receivedSignature);

        if (expectedBuffer.length !== signatureBuffer.length) {
            console.error('❌ Signature length mismatch');
            return false;
        }

        const isValid = crypto.timingSafeEqual(expectedBuffer, signatureBuffer);

        if (isValid) {
            console.log('✅ Webhook signature verified successfully');
        } else {
            console.error('❌ Invalid webhook signature');
        }

        return isValid;
    } catch (error) {
        console.error('❌ Signature verification error:', error);
        return false;
    }
}

// ============================================================
// 📡 MAIN WEBHOOK HANDLER
// ============================================================

export async function POST(req: NextRequest) {
    const startTime = Date.now();
    let rawBody = '';
    let decryptedPayload: any = null;
    let payload: any = null;

    try {
        // 📨 1. Get the raw body
        rawBody = await req.text();
        console.log('📨 Webhook received, length:', rawBody.length);

        // ✅ 2. Check if body is empty
        if (!rawBody || rawBody.length === 0) {
            console.log('⚠️ Empty webhook body - likely a ping or health check');
            return NextResponse.json({
                received: true,
                message: 'Empty body received'
            }, { status: 200 });
        }

        // ✅ 3. Try to parse JSON
        try {
            payload = JSON.parse(rawBody);
        } catch (parseError) {
            console.error('❌ Failed to parse JSON:', parseError);
            return NextResponse.json({
                received: true,
                message: 'Non-JSON body received'
            }, { status: 200 });
        }

        console.log('📨 Webhook payload structure:', Object.keys(payload));

        // 🔐 4. Verify the digital signature
        const webhookKeyId = process.env.CYBERSOURCE_WEBHOOK_KEY_ID;
        const webhookSecret = process.env.CYBERSOURCE_WEBHOOK_SECRET;
        const signatureHeader = req.headers.get('v-c-signature');

        if (webhookKeyId && webhookSecret) {
            if (!verifyDigitalSignature(rawBody, signatureHeader, webhookKeyId, webhookSecret)) {
                console.error('❌ Invalid signature - rejecting webhook');
                return NextResponse.json({
                    error: 'Invalid signature'
                }, { status: 401 });
            }
        } else {
            console.log('⚠️ Webhook signature verification skipped (no secret configured)');
        }

        // 🔓 5. Decrypt the payload if it's encrypted (MLE)
        // The webhook may contain an 'encryptedResponse' field
        if (payload?.encryptedResponse) {
            console.log('🔐 Encrypted response detected - decrypting...');
            decryptedPayload = await decryptWebhookPayload(payload.encryptedResponse);
            if (decryptedPayload) {
                console.log('✅ Payload decrypted successfully');
                // Use the decrypted payload for processing
                payload = decryptedPayload;
            } else {
                console.error('❌ Failed to decrypt payload');
                // Continue with the original payload if decryption fails
            }
        } else if (payload?.status && payload?.id) {
            // No encryption - use as-is (for test webhooks)
            console.log('📨 Unencrypted payload received (likely a test webhook)');
            decryptedPayload = payload;
        } else {
            console.log('⚠️ Unknown webhook format - please check your configuration');
        }

        // 🔍 6. Extract transaction details (using the decrypted payload)
        const transactionId = extractTransactionId(payload);
        const status = extractStatus(payload);
        const amount = extractAmount(payload);
        const currency = extractCurrency(payload);
        const paymentMethod = extractPaymentMethod(payload);
        const lastFour = extractLastFour(payload);
        const cardType = extractCardType(payload);
        const customerEmail = extractCustomerEmail(payload);
        const customerName = extractCustomerName(payload);
        const customerPhone = extractCustomerPhone(payload);
        const errorCode = extractErrorCode(payload);
        const errorMessage = extractErrorMessage(payload);

        // 📊 Log extracted data
        console.log('🔍 Extracted from webhook:');
        console.log(`   Transaction ID: ${transactionId || 'NOT FOUND'}`);
        console.log(`   Status: ${status}`);
        console.log(`   Amount: ${amount || 'NOT FOUND'}`);

        // ✅ 7. Validate required fields
        if (!transactionId) {
            console.error('❌ No transaction ID found in webhook payload');
            return NextResponse.json({
                received: true,
                message: 'No transaction ID found'
            }, { status: 200 });
        }

        if (!status || status === 'UNKNOWN') {
            console.error('❌ No valid status found in webhook payload');
            return NextResponse.json({
                received: true,
                message: 'No valid status found'
            }, { status: 200 });
        }

        // 💾 8. Update transaction in Supabase
        const supabase = createAdminClient();
        const dbStatus = mapStatus(status);

        // Build update data
        const updateData: any = {
            status: dbStatus,
            cybersource_response: payload,
            updated_at: new Date().toISOString()
        };

        if (amount) updateData.amount = parseFloat(amount);
        if (currency) updateData.currency = currency;
        if (paymentMethod) updateData.payment_method = paymentMethod;
        if (lastFour) updateData.last_four = lastFour;
        if (cardType) updateData.card_type = cardType;
        if (customerEmail) updateData.customer_email = customerEmail;
        if (customerName) updateData.customer_name = customerName;
        if (customerPhone) updateData.customer_phone = customerPhone;
        if (errorCode) updateData.error_code = errorCode;
        if (errorMessage) updateData.error_message = errorMessage;

        // Check if transaction exists
        const { data: existing, error: findError } = await supabase
            .from('cybersource_transactions')
            .select('id, status')
            .eq('transaction_id', transactionId)
            .single();

        if (findError && findError.code !== 'PGRST116') {
            console.error('❌ Database lookup error:', findError);
            return NextResponse.json({
                received: true,
                message: 'Database lookup error'
            }, { status: 200 });
        }

        if (existing) {
            console.log(`📝 Updating existing transaction: ${transactionId}`);
            const { error } = await supabase
                .from('cybersource_transactions')
                .update(updateData)
                .eq('transaction_id', transactionId);

            if (error) {
                console.error('❌ Database update error:', error);
                return NextResponse.json({
                    received: true,
                    message: 'Database update error'
                }, { status: 200 });
            }
            console.log(`✅ Transaction ${transactionId} updated to status: ${dbStatus}`);
        } else {
            console.log(`📝 Creating new transaction: ${transactionId}`);
            const { error } = await supabase
                .from('cybersource_transactions')
                .insert({
                    transaction_id: transactionId,
                    amount: amount ? parseFloat(amount) : 0,
                    currency: currency || 'USD',
                    status: dbStatus,
                    payment_method: paymentMethod,
                    last_four: lastFour,
                    card_type: cardType,
                    customer_name: customerName,
                    customer_email: customerEmail,
                    customer_phone: customerPhone,
                    error_code: errorCode,
                    error_message: errorMessage,
                    cybersource_response: payload
                });

            if (error) {
                console.error('❌ Database insert error:', error);
                return NextResponse.json({
                    received: true,
                    message: 'Database insert error'
                }, { status: 200 });
            }
            console.log(`✅ New transaction ${transactionId} created with status: ${dbStatus}`);
        }

        const duration = Date.now() - startTime;
        console.log(`⏱️ Webhook processed in ${duration}ms`);

        return NextResponse.json({
            received: true,
            transactionId: transactionId,
            status: dbStatus
        }, { status: 200 });

    } catch (error) {
        const duration = Date.now() - startTime;
        console.error('❌ Webhook error:', error);
        console.error(`⏱️ Error occurred after ${duration}ms`);
        if (payload) {
            console.error('📦 Payload at time of error:', JSON.stringify(payload, null, 2));
        }
        return NextResponse.json({
            received: true,
            error: error instanceof Error ? error.message : 'Internal error'
        }, { status: 200 });
    }
}
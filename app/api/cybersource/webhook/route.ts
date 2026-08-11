// app/api/cybersource/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

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
        console.log('⚠️ No signature header found');
        return false;
    }

    try {
        // Parse the signature header
        const parts = signatureHeader.split(',');
        const keyIdPart = parts.find(p => p.trim().startsWith('keyId='));
        const sigPart = parts.find(p => p.trim().startsWith('signature='));

        if (!keyIdPart || !sigPart) {
            console.log('⚠️ Missing keyId or signature in header');
            return false;
        }

        const receivedKeyId = keyIdPart.trim().replace('keyId=', '');
        const receivedSignature = sigPart.trim().replace('signature=', '');

        console.log(`🔑 Received Key ID: ${receivedKeyId}`);
        console.log(`🔑 Expected Key ID: ${keyId}`);

        if (receivedKeyId !== keyId) {
            console.error(`❌ Key ID mismatch`);
            return false;
        }

        // Create HMAC SHA256 with the shared secret
        const hmac = crypto.createHmac('sha256', Buffer.from(secret, 'base64'));
        const expectedSignature = hmac.update(payload).digest('base64');

        const isValid = crypto.timingSafeEqual(
            Buffer.from(receivedSignature),
            Buffer.from(expectedSignature)
        );

        if (isValid) {
            console.log('✅ Digital signature verified successfully');
        } else {
            console.error('❌ Invalid digital signature');
        }

        return isValid;
    } catch (error) {
        console.error('❌ Signature verification error:', error);
        return false;
    }
}

// ============================================================
// 🩺 HEALTH CHECK (GET)
// ============================================================

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const healthCheck = searchParams.get('healthCheck');

    console.log('🩺 Health check received:', healthCheck);
    console.log('📋 Headers:', Object.fromEntries(req.headers.entries()));

    return NextResponse.json({
        status: 'ok',
        message: 'Webhook is healthy',
        timestamp: new Date().toISOString()
    }, { status: 200 });
}

// ============================================================
// 📡 WEBHOOK HANDLER (POST) - SIMPLIFIED FOR TESTING
// ============================================================

export async function POST(req: NextRequest) {
    console.log('========================================');
    console.log('🚀 WEBHOOK POST RECEIVED!');
    console.log('========================================');
    console.log(`⏰ Time: ${new Date().toISOString()}`);
    console.log(`📍 URL: ${req.url}`);

    // 📋 Log all headers
    const headers = Object.fromEntries(req.headers.entries());
    console.log('📋 All Headers:', JSON.stringify(headers, null, 2));

    try {
        // 📨 Get the raw body
        const rawBody = await req.text();
        console.log(`📦 Raw body length: ${rawBody.length}`);
        console.log(`📦 Raw body: ${rawBody}`);

        // ✅ Check if body is empty
        if (!rawBody || rawBody.length === 0) {
            console.log('⚠️ Empty webhook body');
            return NextResponse.json({ received: true }, { status: 200 });
        }

        // 🔐 Verify digital signature
        const signatureHeader = req.headers.get('v-c-signature') ||
            req.headers.get('signature') ||
            req.headers.get('x-signature');

        const webhookKeyId = process.env.CYBERSOURCE_WEBHOOK_KEY_ID;
        const webhookSecret = process.env.CYBERSOURCE_WEBHOOK_SECRET;

        console.log('🔐 Signature header:', signatureHeader || 'NOT FOUND');
        console.log('🔑 Webhook Key ID from env:', webhookKeyId ? 'SET' : 'NOT SET');
        console.log('🔑 Webhook Secret from env:', webhookSecret ? 'SET' : 'NOT SET');

        if (webhookKeyId && webhookSecret && signatureHeader) {
            const isValid = verifyDigitalSignature(rawBody, signatureHeader, webhookKeyId, webhookSecret);
            console.log(`✅ Signature valid: ${isValid}`);
        } else {
            console.log('⚠️ Signature verification skipped - missing env or header');
        }

        // 📨 Parse JSON
        let payload;
        try {
            payload = JSON.parse(rawBody);
            console.log('✅ JSON parsed successfully');
            console.log('📨 Payload:', JSON.stringify(payload, null, 2));
        } catch (parseError) {
            console.error('❌ Failed to parse JSON:', parseError);
            return NextResponse.json({ received: true }, { status: 200 });
        }

        // ✅ Check if this is a test webhook
        const webhookPayload = payload.payload || payload;

        if (webhookPayload?.message && typeof webhookPayload.message === 'string') {
            console.log('🧪 TEST WEBHOOK DETECTED');
            console.log('📨 Message:', webhookPayload.message);
            return NextResponse.json({
                received: true,
                test: true,
                message: 'Test webhook received'
            }, { status: 200 });
        }

        // 🔍 Extract transaction ID
        const transactionId = webhookPayload?.id ||
            webhookPayload?.transactionId ||
            webhookPayload?.details?.processorInformation?.transactionId;

        const status = webhookPayload?.status || webhookPayload?.outcome;

        console.log('========================================');
        console.log('🔍 EXTRACTED DATA:');
        console.log(`   Transaction ID: ${transactionId || 'NOT FOUND'}`);
        console.log(`   Status: ${status || 'NOT FOUND'}`);
        console.log(`   Amount: ${webhookPayload?.amount || webhookPayload?.details?.orderInformation?.amountDetails?.totalAmount || 'NOT FOUND'}`);
        console.log(`   Event Type: ${payload.eventType || 'UNKNOWN'}`);
        console.log('========================================');

        // ✅ Return success - always return 200
        return NextResponse.json({
            received: true,
            transactionId: transactionId || null,
            status: status || null
        }, { status: 200 });

    } catch (error) {
        console.error('❌ Webhook error:', error);
        console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack');
        // Always return 200 to prevent retries
        return NextResponse.json({
            received: true,
            error: error instanceof Error ? error.message : 'Internal error'
        }, { status: 200 });
    }
}
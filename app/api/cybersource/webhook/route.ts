// app/api/cybersource/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';
import path from 'path';

// ✅ Import the JWT client
const { CybsJwtClient } = require('@ryankleindev/cybs-jwt-client');

// ✅ Initialize the client once
const client = new CybsJwtClient({
    runEnvironment: 'apitest.cybersource.com',
    merchantId: process.env.CYBERSOURCE_MERCHANT_ID,
    requestP12: {
        path: path.resolve('./certificate/belarisu_1777926367.p12'),
        password: process.env.CYBERSOURCE_P12_PASSWORD
    },
    responseP12: {
        path: path.resolve('./certificate/belarisu_1777926367.p12'),
        password: process.env.CYBERSOURCE_P12_PASSWORD
    },
    defaultMle: { response: true }
});

// ============================================================
// 🔍 HELPER FUNCTIONS
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
// 🗺️ MAP STATUS
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
        console.log('⚠️ No signature header found - skipping verification');
        return true;
    }

    try {
        const parts = signatureHeader.split(',');
        const keyIdPart = parts.find(p => p.trim().startsWith('keyId='));
        const sigPart = parts.find(p => p.trim().startsWith('signature='));

        if (!keyIdPart || !sigPart) {
            console.log('⚠️ Missing keyId or signature in header - skipping verification');
            return true;
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

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const healthCheck = searchParams.get('healthCheck');

    console.log('🩺 Health check received:', healthCheck);

    return NextResponse.json({
        status: 'ok',
        message: 'Webhook is healthy',
        timestamp: new Date().toISOString()
    }, { status: 200 });
}

// ============================================================
// 📡 MAIN WEBHOOK HANDLER
// ============================================================

export async function POST(req: NextRequest) {
    const startTime = Date.now();

    console.log('========================================');
    console.log('📨 WEBHOOK REQUEST RECEIVED');
    console.log('========================================');
    console.log(`⏰ Time: ${new Date().toISOString()}`);
    console.log(`🌐 Method: ${req.method}`);
    console.log(`📍 URL: ${req.url}`);

    try {
        // 📨 1. Get the raw body
        const rawBody = await req.text();
        console.log(`📦 Raw body length: ${rawBody.length}`);
        console.log(`📦 Raw body preview: ${rawBody.substring(0, 500)}`);

        // ✅ 2. Check if body is empty
        if (!rawBody || rawBody.length === 0) {
            console.log('⚠️ Empty webhook body - likely a ping or health check');
            return NextResponse.json({
                received: true,
                message: 'Empty body received'
            }, { status: 200 });
        }

        // ✅ 3. Parse JSON
        let payload;
        try {
            payload = JSON.parse(rawBody);
            console.log('✅ JSON parsed successfully');
        } catch (parseError) {
            console.error('❌ Failed to parse JSON:', parseError);
            return NextResponse.json({
                received: true,
                message: 'Non-JSON body received'
            }, { status: 200 });
        }

        console.log('📨 Payload structure:', Object.keys(payload));

        // ✅ 4. Check if this is a test webhook
        const webhookPayload = payload.payload || payload;

        if (webhookPayload?.message && typeof webhookPayload.message === 'string') {
            console.log('🧪 Test webhook detected - skipping processing');
            console.log('📨 Message:', webhookPayload.message);
            return NextResponse.json({
                received: true,
                test: true,
                message: 'Test webhook received successfully'
            }, { status: 200 });
        }

        // ✅ 5. Decrypt the payload using JWT client (MLE)
        let decryptedPayload = webhookPayload;

        // Check if the payload is encrypted (has encryptedResponse field)
        if (webhookPayload?.encryptedResponse) {
            console.log('🔐 Encrypted payload detected - decrypting with MLE...');
            try {
                // ✅ Use the JWT client to decrypt
                // The client automatically handles MLE decryption
                const response = await client.post('/uc/v1/decrypt', {
                    encryptedResponse: webhookPayload.encryptedResponse
                });
                decryptedPayload = response;
                console.log('✅ Payload decrypted successfully');
                console.log('📨 Decrypted payload:', JSON.stringify(decryptedPayload, null, 2));
            } catch (decryptError) {
                console.error('❌ Failed to decrypt payload:', decryptError);
                // Continue with the original payload if decryption fails
                decryptedPayload = webhookPayload;
            }
        } else {
            console.log('📨 Unencrypted payload received (or already decrypted)');
            decryptedPayload = webhookPayload;
        }

        // 🔍 6. Extract transaction details from the decrypted payload
        const transactionId = extractTransactionId(decryptedPayload) || decryptedPayload?.id;
        const status = extractStatus(decryptedPayload);
        const amount = extractAmount(decryptedPayload);
        const currency = extractCurrency(decryptedPayload);
        const paymentMethod = extractPaymentMethod(decryptedPayload);
        const lastFour = extractLastFour(decryptedPayload);
        const cardType = extractCardType(decryptedPayload);
        const customerEmail = extractCustomerEmail(decryptedPayload);
        const customerName = extractCustomerName(decryptedPayload);
        const customerPhone = extractCustomerPhone(decryptedPayload);
        const errorCode = extractErrorCode(decryptedPayload);
        const errorMessage = extractErrorMessage(decryptedPayload);

        // 📊 Log extracted data
        console.log('========================================');
        console.log('🔍 EXTRACTED FROM WEBHOOK:');
        console.log(`   Transaction ID: ${transactionId || 'NOT FOUND'}`);
        console.log(`   Status: ${status}`);
        console.log(`   Amount: ${amount || 'NOT FOUND'}`);
        console.log(`   Event Type: ${payload.eventType || 'UNKNOWN'}`);
        console.log('========================================');

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

        const updateData: any = {
            status: dbStatus,
            cybersource_response: decryptedPayload,
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
                    cybersource_response: decryptedPayload
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
        console.log('========================================\n');

        return NextResponse.json({
            received: true,
            transactionId: transactionId,
            status: dbStatus
        }, { status: 200 });

    } catch (error) {
        console.error('❌ Webhook error:', error);
        return NextResponse.json({
            received: true,
            error: error instanceof Error ? error.message : 'Internal error'
        }, { status: 200 });
    }
}
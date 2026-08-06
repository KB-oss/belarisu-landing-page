// app/api/cybersource/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';

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

    // Return 200 OK for health checks
    return NextResponse.json({
        status: 'ok',
        message: 'Webhook is healthy',
        timestamp: new Date().toISOString()
    }, { status: 200 });
}

// ============================================================
// 📡 MAIN WEBHOOK HANDLER WITH FULL REQUEST LOGGING
// ============================================================

export async function POST(req: NextRequest) {
    const startTime = Date.now();

    // 📋 Log the entire request
    console.log('========================================');
    console.log('📨 WEBHOOK REQUEST RECEIVED');
    console.log('========================================');
    console.log(`⏰ Time: ${new Date().toISOString()}`);
    console.log(`🌐 Method: ${req.method}`);
    console.log(`📍 URL: ${req.url}`);

    // Log all headers
    const headers = Object.fromEntries(req.headers.entries());
    console.log('📋 Headers:', JSON.stringify(headers, null, 2));

    try {
        // 📨 1. Get the raw body
        const rawBody = await req.text();
        console.log(`📦 Raw body length: ${rawBody.length}`);
        console.log(`📦 Raw body preview: ${rawBody.substring(0, 500)}${rawBody.length > 500 ? '...' : ''}`);

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
            console.log('📦 Raw body that failed:', rawBody);
            return NextResponse.json({
                received: true,
                message: 'Non-JSON body received'
            }, { status: 200 });
        }

        // 📋 Log the full payload structure
        console.log('📨 Payload structure:', Object.keys(payload));
        console.log('📨 Full payload:', JSON.stringify(payload, null, 2));

        // ✅ 4. Handle the webhook payload
        const webhookPayload = payload.payload || payload;
        console.log('📨 Webhook data structure:', Object.keys(webhookPayload));
        console.log('📨 Webhook data:', JSON.stringify(webhookPayload, null, 2));

        // 🔐 5. Verify the digital signature (if present)
        const webhookKeyId = process.env.CYBERSOURCE_WEBHOOK_KEY_ID;
        const webhookSecret = process.env.CYBERSOURCE_WEBHOOK_SECRET;

        // Try multiple header names for signature
        const signatureHeader = req.headers.get('v-c-signature') ||
            req.headers.get('signature') ||
            req.headers.get('x-signature');

        console.log(`🔐 Signature header: ${signatureHeader || 'NOT FOUND'}`);

        if (webhookKeyId && webhookSecret) {
            const isValid = verifyDigitalSignature(rawBody, signatureHeader, webhookKeyId, webhookSecret);
            if (!isValid) {
                console.error('❌ Invalid signature - rejecting webhook');
                return NextResponse.json({
                    error: 'Invalid signature'
                }, { status: 401 });
            }
        } else {
            console.log('⚠️ Webhook signature verification skipped (no secret configured)');
        }

        // 🔍 6. Extract transaction details from the webhook payload
        const transactionId = extractTransactionId(webhookPayload) || webhookPayload?.id;
        const status = extractStatus(webhookPayload);
        const amount = extractAmount(webhookPayload);
        const currency = extractCurrency(webhookPayload);
        const paymentMethod = extractPaymentMethod(webhookPayload);
        const lastFour = extractLastFour(webhookPayload);
        const cardType = extractCardType(webhookPayload);
        const customerEmail = extractCustomerEmail(webhookPayload);
        const customerName = extractCustomerName(webhookPayload);
        const customerPhone = extractCustomerPhone(webhookPayload);
        const errorCode = extractErrorCode(webhookPayload);
        const errorMessage = extractErrorMessage(webhookPayload);

        // 📊 Log extracted data
        console.log('========================================');
        console.log('🔍 EXTRACTED FROM WEBHOOK:');
        console.log(`   Transaction ID: ${transactionId || 'NOT FOUND'}`);
        console.log(`   Status: ${status}`);
        console.log(`   Amount: ${amount || 'NOT FOUND'}`);
        console.log(`   Currency: ${currency || 'NOT FOUND'}`);
        console.log(`   Payment Method: ${paymentMethod || 'NOT FOUND'}`);
        console.log(`   Last Four: ${lastFour || 'NOT FOUND'}`);
        console.log(`   Card Type: ${cardType || 'NOT FOUND'}`);
        console.log(`   Customer Email: ${customerEmail || 'NOT FOUND'}`);
        console.log(`   Customer Name: ${customerName || 'NOT FOUND'}`);
        console.log(`   Event Type: ${payload.eventType || 'UNKNOWN'}`);
        console.log(`   Product ID: ${payload.productId || 'UNKNOWN'}`);
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

        // Build update data
        const updateData: any = {
            status: dbStatus,
            cybersource_response: webhookPayload,
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
                    cybersource_response: webhookPayload
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
        const duration = Date.now() - startTime;
        console.error('❌ Webhook error:', error);
        console.error(`⏱️ Error occurred after ${duration}ms`);
        console.error('📦 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        console.log('========================================\n');

        return NextResponse.json({
            received: true,
            error: error instanceof Error ? error.message : 'Internal error'
        }, { status: 200 });
    }
}
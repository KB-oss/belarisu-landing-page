// app/api/cybersource/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';
import { log } from 'console';

// Helper to verify webhook signature (optional but recommended)
function verifySignature(payload: string, signature: string, secret: string): boolean {
    try {
        const hmac = crypto.createHmac('sha256', secret);
        const expectedSignature = hmac.update(payload).digest('hex');
        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );
    } catch (error) {
        console.error('Signature verification error:', error);
        return false;
    }
}

export async function POST(req: NextRequest) {
    const startTime = Date.now();
    let payload: any;

    try {
        // 📨 1. Receive the webhook payload
        payload = await req.json();

        // 🔥 LOGGING - Webhook received
        console.error('🚀 WEBHOOK HIT at', new Date().toISOString());
        console.error('📨 Webhook received:', JSON.stringify(payload, null, 2));
        console.error('📋 Headers:', JSON.stringify(Object.fromEntries(req.headers), null, 2));

        // 🔐 2. Verify signature (if you have a webhook secret configured)
        const signature = req.headers.get('x-webhook-signature') || req.headers.get('signature');

        // Optional: Uncomment to enable signature verification
        // const webhookSecret = process.env.CYBERSOURCE_WEBHOOK_SECRET!;
        // if (signature && !verifySignature(JSON.stringify(payload), signature, webhookSecret)) {
        //     console.error('❌ Invalid webhook signature');
        //     return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        // }

        // 🔍 3. Extract transaction details from the webhook
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

        // 🔥 LOGGING - Extracted data
        console.error('🔍 Extracted from webhook:');
        console.error(`   Transaction ID: ${transactionId || 'NOT FOUND'}`);
        console.error(`   Status: ${status}`);
        console.error(`   Amount: ${amount || 'NOT FOUND'}`);
        console.error(`   Currency: ${currency || 'NOT FOUND'}`);
        console.error(`   Payment Method: ${paymentMethod || 'NOT FOUND'}`);
        console.error(`   Last Four: ${lastFour || 'NOT FOUND'}`);
        console.error(`   Card Type: ${cardType || 'NOT FOUND'}`);
        console.error(`   Customer Email: ${customerEmail || 'NOT FOUND'}`);
        console.error(`   Customer Name: ${customerName || 'NOT FOUND'}`);
        console.error(`   Error Code: ${errorCode || 'NONE'}`);
        console.error(`   Error Message: ${errorMessage || 'NONE'}`);

        if (!transactionId) {
            console.error('❌ No transaction ID found in webhook payload');
            return NextResponse.json({ error: 'No transaction ID' }, { status: 400 });
        }

        console.error(`🔍 Processing webhook for transaction: ${transactionId}`);
        console.error(`📊 Status: ${status}`);

        // 💾 4. Update transaction in Supabase
        const supabase = createAdminClient();

        // First, check if the transaction exists
        console.error('📤 Checking if transaction exists in database...');
        const { data: existing, error: findError } = await supabase
            .from('cybersource_transactions')
            .select('id, status')
            .eq('transaction_id', transactionId)
            .single();

        if (findError && findError.code !== 'PGRST116') { // PGRST116 = not found
            console.error('❌ Database lookup error:', findError);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        console.error(`📊 Transaction exists: ${!!existing}`);
        if (existing) {
            console.error(`   Current status: ${existing.status}`);
        }

        // Map Cybersource status to your database status
        const dbStatus = mapStatus(status);

        let updateData: any = {
            status: dbStatus,
            cybersource_response: payload,
            updated_at: new Date().toISOString()
        };

        // Add additional fields if available
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

        let result;

        if (existing) {
            // Update existing transaction
            console.error(`📝 Updating existing transaction: ${transactionId}`);
            const { data, error } = await supabase
                .from('cybersource_transactions')
                .update(updateData)
                .eq('transaction_id', transactionId)
                .select();

            if (error) {
                console.error('❌ Database update error:', error);
                return NextResponse.json({ error: 'Database error' }, { status: 500 });
            }
            result = data;
            console.error(`✅ Transaction ${transactionId} updated successfully`);
        } else {
            // Create new transaction if it doesn't exist (fallback)
            console.error(`📝 Creating new transaction: ${transactionId}`);
            const { data, error } = await supabase
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
                })
                .select();

            if (error) {
                console.error('❌ Database insert error:', error);
                return NextResponse.json({ error: 'Database error' }, { status: 500 });
            }
            result = data;
            console.error(`✅ New transaction ${transactionId} created successfully`);
        }

        const duration = Date.now() - startTime;
        console.error(`✅ Transaction ${transactionId} updated to status: ${dbStatus}`);
        console.error(`⏱️ Request completed in ${duration}ms`);

        // ✅ 5. Return 200 OK to acknowledge receipt
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
        // Always return 200 to prevent retries
        return NextResponse.json(
            {
                received: false,
                error: error instanceof Error ? error.message : 'Internal server error',
                details: error instanceof Error ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

// 🔍 Helper functions to extract data from webhook payload
// These will need to be adjusted based on the actual Cybersource webhook structure

function extractTransactionId(payload: any): string | null {
    return payload?.id ||
        payload?.transactionId ||
        payload?.details?.processorInformation?.transactionId ||
        payload?.clientReferenceInformation?.code ||
        null;
}

function extractStatus(payload: any): string {
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

// 🗺️ Map Cybersource status to database status
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
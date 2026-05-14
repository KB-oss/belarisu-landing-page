import { createClient } from '@/lib/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const headers = new Headers();
    headers.set('ngrok-skip-browser-warning', '1');
    
    try {
        const callbackData = await req.json();

        console.log('M-Pesa Callback Received:', JSON.stringify(callbackData, null, 2));

        const { stkCallback } = callbackData.Body;
        
        const {
            CheckoutRequestID,
            ResultCode,
            ResultDesc,
            CallbackMetadata,
        } = stkCallback;

        // Prepare update data
        const updateData: any = {
            result_code: ResultCode,
            result_description: ResultDesc,
            updated_at: new Date().toISOString(),
        };

        // Determine status based on result code
        // For sandbox: treat 1037 (timeout) as success for testing
        const isSandbox = (process.env.MPESA_API_URL == 'https://sandbox.safaricom.co.ke')
        const isSuccessful = ResultCode === 0 || (isSandbox && ResultCode === 1037);

        if (isSuccessful) {
            updateData.status = 'completed';
            
            // Extract metadata from successful transaction
            if (CallbackMetadata?.Item) {
                const metadata = CallbackMetadata.Item;
                
                const amount = metadata.find((item: any) => item.Name === 'Amount')?.Value;
                const mpesaReceiptNumber = metadata.find(
                    (item: any) => item.Name === 'MpesaReceiptNumber'
                )?.Value;
                const transactionDate = metadata.find(
                    (item: any) => item.Name === 'TransactionDate'
                )?.Value;
                
                if (amount) updateData.amount = amount;
                if (mpesaReceiptNumber) updateData.mpesa_receipt_number = mpesaReceiptNumber;
                
                if (transactionDate) {
                    const dateStr = transactionDate.toString();
                    updateData.transaction_date = new Date(
                        parseInt(dateStr.slice(0, 4)),
                        parseInt(dateStr.slice(4, 6)) - 1,
                        parseInt(dateStr.slice(6, 8)),
                        parseInt(dateStr.slice(8, 10)),
                        parseInt(dateStr.slice(10, 12)),
                        parseInt(dateStr.slice(12, 14))
                    );
                }
            }
            
            // For sandbox timeout, generate a test receipt number
            if (ResultCode === 1037 && !updateData.mpesa_receipt_number) {
                updateData.mpesa_receipt_number = `SANDBOX_${Date.now()}`;
            }
            
            console.log(`✅ Payment successful for ${CheckoutRequestID}`);
            
        } else if (ResultCode === 1037) {
            // Real timeout (production) - user didn't enter PIN
            updateData.status = 'timeout';
            console.log(`⏱️ Payment timeout for ${CheckoutRequestID}`);
            
        } else if (ResultCode === 1032) {
            // User cancelled or insufficient balance
            updateData.status = 'failed';
            console.log(`❌ Payment cancelled or insufficient balance for ${CheckoutRequestID}`);
            
        } else {
            // Any other error code
            updateData.status = 'failed';
            console.log(`❌ Payment failed with code ${ResultCode}: ${ResultDesc} for ${CheckoutRequestID}`);
        }

        const supabase = await createClient();
        
        // Update database
        const { error } = await supabase
            .from('donations')
            .update(updateData)
            .eq('checkout_request_id', CheckoutRequestID);

        if (error) {
            console.error('Database update error:', error);
            return NextResponse.json(
                { ResultCode: 1, ResultDesc: 'Database update failed' },
                { status: 500, headers }
            );
        }

        // Return success response to M-Pesa
        return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' }, { headers });
        
    } catch (error) {
        console.error('Callback error:', error);
        return NextResponse.json(
            { ResultCode: 1, ResultDesc: 'Internal error' },
            { status: 500, headers }
        );
    }
}
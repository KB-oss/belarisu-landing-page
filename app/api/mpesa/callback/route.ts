import { createClient } from '@/lib/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const headers = new Headers();
    headers.set('ngrok-skip-browser-warning', '1');
    try {
        const callbackData = await req.json();

        console.log('M-Pesa Callback Received:', JSON.stringify(callbackData, null, 2));

        const { stkCallback } = callbackData.Body;
        console.log(stkCallback, 'callback');

        const {
            MerchantRequestID,
            CheckoutRequestID,
            ResultCode,
            ResultDesc,
            CallbackMetadata,
        } = stkCallback;
        console.log(CallbackMetadata);

        // Prepare update data
        const updateData: any = {
            result_code: ResultCode,
            result_description: ResultDesc,
            updated_at: new Date().toISOString(),
        };

        // Check if successful
        if (ResultCode) {
            // const metadata = CallbackMetadata.Item;

            // const amount = metadata.find((item: any) => item.Name === 'Amount')?.Value;
            // const mpesaReceiptNumber = metadata.find(
            //     (item: any) => item.Name === 'MpesaReceiptNumber'
            // )?.Value;
            // const transactionDate = metadata.find(
            //     (item: any) => item.Name === 'TransactionDate'
            // )?.Value;

            updateData.status = 'completed';
            // updateData.mpesa_receipt_number = mpesaReceiptNumber;
            // updateData.transaction_date = transactionDate
            //     ? new Date(
            //         parseInt(transactionDate.toString().slice(0, 4)),
            //         parseInt(transactionDate.toString().slice(4, 6)) - 1,
            //         parseInt(transactionDate.toString().slice(6, 8)),
            //         parseInt(transactionDate.toString().slice(8, 10)),
            //         parseInt(transactionDate.toString().slice(10, 12)),
            //         parseInt(transactionDate.toString().slice(12, 14))
            //     )
            //     : new Date();
        } else {
            updateData.status = 'failed';
        }
        const supabase = await createClient()
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

        return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' }, { headers });
    } catch (error) {
        console.error('Callback error:', error);
        return NextResponse.json(
            { ResultCode: 1, ResultDesc: 'Internal error' },
            { status: 500, headers }
        );
    }
}
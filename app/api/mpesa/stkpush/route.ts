import { createClient } from '@/lib/supabase/server';
import { error } from 'console';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {

    try {
        const { amount, phoneNumber } = await req.json();

        // Validate input
        if (!amount || !phoneNumber) {
            return NextResponse.json(
                { error: 'Amount and phone number are required' },
                { status: 400 }
            );
        }

        // Format phone number (2547XXXXXXXX)
        let formattedPhone = phoneNumber.replace(/\D/g, '');
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '254' + formattedPhone.substring(1);
        }
        if (!formattedPhone.startsWith('254')) {
            formattedPhone = '254' + formattedPhone;
        }

        // 1. Get OAuth token
        const auth = Buffer.from(
            `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
        ).toString('base64');

        const tokenRes = await fetch(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            {
                method: 'GET',
                headers: { Authorization: `Basic ${auth}` },
            }
        );

        const { access_token } = await tokenRes.json();

        if (!access_token) {
            throw new Error('Failed to get access token');
        }

        // 2. Prepare STK Push request
        const timestamp = new Date()
            .toISOString()
            .replace(/[^0-9]/g, '')
            .slice(0, 14);

        const password = Buffer.from(
            `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
        ).toString('base64');

        const stkPushRequest = {
            BusinessShortCode: process.env.MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: Math.round(amount),
            PartyA: formattedPhone,
            PartyB: process.env.MPESA_SHORTCODE,
            PhoneNumber: formattedPhone,
            CallBackURL: process.env.MPESA_CALLBACK_URL,
            AccountReference: `DONATION_${Date.now()}`,
            TransactionDesc: 'Donation Payment',
        };

        // 3. Make STK Push request
        const stkRes = await fetch(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(stkPushRequest),
            }
        );

        const stkData = await stkRes.json();
        console.log(stkData);
        

        // 4. Store in Supabase
        if (stkData.CheckoutRequestID) {
            const supabase = await createClient();
            const {data, error } = await supabase.from('donations').insert({
                checkout_request_id: stkData.CheckoutRequestID,
                phone_number: formattedPhone,
                amount: Math.round(amount),
                status: 'pending',
            });
            if (error) {
                console.log(error, 'supabase not updated !!')
            }
        }
       

        return NextResponse.json({
            success: stkData.ResponseCode === '0',
            message: stkData.ResponseDescription,
            checkoutRequestId: stkData.CheckoutRequestID,
        });
    } catch (error) {
        console.error('STK Push error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
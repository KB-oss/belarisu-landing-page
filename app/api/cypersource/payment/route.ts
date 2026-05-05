// app/api/cybersource/payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency, cardDetails, cardholderName, customer } = body;

    // Generate unique transaction ID
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare Cybersource API request
    const cybersourcePayload = {
      clientReferenceInformation: {
        code: transactionId
      },
      processingInformation: {
        capture: true,
        commerceIndicator: "internet"
      },
      paymentInformation: {
        card: {
          number: cardDetails.number,
          expirationMonth: cardDetails.expiryMonth,
          expirationYear: cardDetails.expiryYear,
          securityCode: cardDetails.cvv
        }
      },
      orderInformation: {
        amountDetails: {
          totalAmount: amount.toString(),
          currency: currency
        },
        billTo: {
          firstName: cardholderName.split(' ')[0] || '',
          lastName: cardholderName.split(' ')[1] || '',
          email: customer.email,
          phoneNumber: customer.phone
        }
      }
    };

    // Make request to Cybersource API
    const cybersourceResponse = await fetch(
      `${process.env.CYBERSOURCE_API_URL}/pts/v2/payments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'merchant-id': process.env.CYBERSOURCE_MERCHANT_ID!,
          'v-c-merchant-id': process.env.CYBERSOURCE_MERCHANT_ID!,
          'v-c-date': new Date().toUTCString(),
          'v-c-request-id': transactionId
        },
        body: JSON.stringify(cybersourcePayload)
      }
    );

    const result = await cybersourceResponse.json();

    // Determine transaction status
    let status = 'pending';
    let errorCode = null;
    let errorMessage = null;

    if (result.status === 'AUTHORIZED' || result.status === 'CAPTURED') {
      status = 'completed';
    } else if (result.status === 'DECLINED') {
      status = 'failed';
      errorCode = result.errorInformation?.reason;
      errorMessage = result.errorInformation?.message;
    } else if (result.status === 'PENDING_AUTHENTICATION') {
      status = 'fraud_review';
    }

    // Store transaction in Supabase
    const { data: transaction, error: dbError } = await supabase
      .from('cybersource_transactions')
      .insert({
        transaction_id: transactionId,
        amount: amount,
        currency: currency,
        status: status,
        payment_method: cardDetails.number.substring(0, 4) || 'unknown',
        last_four: cardDetails.number.slice(-4),
        card_type: detectCardType(cardDetails.number),
        customer_name: cardholderName,
        customer_email: customer.email,
        customer_phone: customer.phone,
        error_code: errorCode,
        error_message: errorMessage,
        cybersource_response: result
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
    }

    // Log admin activity
    await supabase.from('admin_payment_logs').insert({
      transaction_id: transaction?.id,
      action: 'payment_initiated',
      notes: `Status: ${status}`
    });

    return NextResponse.json({
      success: status === 'completed',
      transactionId: transactionId,
      status: status,
      error: errorMessage
    });

  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}

// Helper function to detect card type from first digits
function detectCardType(cardNumber: string): string {
  const firstDigit = cardNumber[0];
  if (firstDigit === '4') return 'visa';
  if (firstDigit === '5') return 'mastercard';
  if (firstDigit === '3') return 'amex';
  if (firstDigit === '6') return 'discover';
  return 'unknown';
}
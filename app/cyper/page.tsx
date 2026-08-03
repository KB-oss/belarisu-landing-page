// app/donate/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard, Lock } from 'lucide-react';
import { UnifiedCheckout } from './unified-checkout';
import { createClient } from '@/lib/supabase/client';

type PaymentStep = 'form' | 'loading' | 'checkout' | 'processing' | 'success' | 'failed';  // ✅ Added 'processing'

export default function DonatePage() {
    const [amount, setAmount] = useState('25');
    const [loading, setLoading] = useState(false);
    const supabase = createClient();
    const [error, setError] = useState('');
    const [step, setStep] = useState<PaymentStep>('form');
    const [captureContext, setCaptureContext] = useState('');
    const [clientLibrary, setClientLibrary] = useState('');
    const [clientLibraryIntegrity, setClientLibraryIntegrity] = useState('');
    const [donationAmount, setDonationAmount] = useState(0);
    const [transactionId, setTransactionId] = useState('');

    // 🔥 SUBSCRIBE to Realtime changes
    useEffect(() => {
        if (!transactionId || step !== 'processing') return;

        const channelName = `payment-updates-${transactionId}`;

        console.log(`📡 Subscribing to channel: ${channelName}`);

        const subscription = supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'cybersource_transactions',
                    filter: `transaction_id=eq.${transactionId}`,
                },
                (payload) => {
                    console.log('🔔 Payment update received:', payload);

                    // ✅ Check the actual status from the payload
                    const newStatus = payload.new.status;

                    if (newStatus === 'completed' || newStatus === 'authorized') {
                        console.log('✅ Payment completed!');
                        setStep('success');
                    } else if (newStatus === 'failed' || newStatus === 'declined') {
                        console.log('❌ Payment failed');
                        setError('Payment was declined');
                        setStep('failed');
                    }
                }
            )
            .subscribe((status) => {
                // ✅ This 'status' is the SUBSCRIPTION connection status, NOT the payment status
                console.log(`📡 Subscription connection status:`, status);
            });

        return () => {
            console.log(`🧹 Unsubscribing from: ${channelName}`);
            supabase.removeChannel(subscription);
        };
    }, [transactionId, step]);

    const handleInitiatePayment = async () => {
        setLoading(true);
        setError('');
        setStep('loading');

        const numAmount = parseFloat(amount);
        setDonationAmount(numAmount);

        try {
            const res = await fetch('/api/cybersource/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: numAmount,
                    donorEmail: 'test@example.com',
                    donorName: 'Test User',
                    donorPhone: '1234567890'
                })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to initiate payment');
            }

            setCaptureContext(data.captureContext);
            setClientLibrary(data.clientLibrary);
            setClientLibraryIntegrity(data.clientLibraryIntegrity);
            setTransactionId(data.transactionId);  // ✅ Store transaction ID
            setStep('checkout');

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Payment initiation failed');
            setStep('form');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = (transId: string) => {
        console.log('✅ Payment successful! Transaction ID:', transId);
        setTransactionId(transId);
        setStep('processing');  // ✅ Go to processing, NOT success
        // The realtime subscription will update to 'success' when webhook updates DB
    };

    const handlePaymentError = (errorMsg: string) => {
        setError(errorMsg);
        setStep('failed');
    };

    const handleCancel = () => {
        setStep('form');
        setError('');
        setTransactionId('');
    };

    const resetForm = () => {
        setStep('form');
        setError('');
        setAmount('25');
        setTransactionId('');
    };

    // ✅ Add processing state
    if (step === 'processing') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-blue-600">Processing Payment</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <div className="flex justify-center">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                        </div>
                        <p>Please wait while we confirm your donation...</p>
                        <p className="text-sm text-gray-500">Transaction ID: {transactionId}</p>
                        <Button variant="outline" onClick={handleCancel} className="w-full">
                            Cancel
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (step === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-green-600">Donation Successful!</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p>Thank you for your donation of <strong>${donationAmount.toFixed(2)}</strong></p>
                        <p className="text-sm text-gray-500">Transaction ID: {transactionId}</p>
                        <Button onClick={resetForm} className="w-full">Make Another Donation</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (step === 'failed') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-red-600">Payment Failed</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-red-600">{error}</p>
                        <Button onClick={resetForm} className="w-full">Try Again</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (step === 'checkout') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <UnifiedCheckout
                            amount={donationAmount}
                            captureContext={captureContext}
                            clientLibrary={clientLibrary}
                            clientLibraryIntegrity={clientLibraryIntegrity}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                            onCancel={handleCancel}
                        />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Make a Donation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Donation Amount (USD)</label>
                        <Input
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="text-lg"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                        <Lock className="h-4 w-4" />
                        <span>Your payment is secure. Card details are encrypted.</span>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded p-3">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <Button
                        onClick={handleInitiatePayment}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        size="lg"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin mr-2" />
                        ) : (
                            <CreditCard className="mr-2 h-4 w-4" />
                        )}
                        {loading ? 'Processing...' : `Donate $${amount}`}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
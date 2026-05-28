// app/donate/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard, Lock } from 'lucide-react';
import { UnifiedCheckout } from './unified-checkout';

type PaymentStep = 'form' | 'loading' | 'checkout' | 'success' | 'failed';

export default function DonatePage() {
    const [amount, setAmount] = useState('25');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState<PaymentStep>('form');
    const [captureContext, setCaptureContext] = useState('');
    const [clientLibrary, setClientLibrary] = useState('');
    const [clientLibraryIntegrity, setClientLibraryIntegrity] = useState('');
    const [donationAmount, setDonationAmount] = useState(0);

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
                    'ngrok-skip-browser-warning': '69420'
                 },
                
                body: JSON.stringify({ amount: numAmount })
            });
            
            const data = await res.json();
            
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to initiate payment');
            }
            
            setCaptureContext(data.captureContext);
            setClientLibrary(data.clientLibrary);
            setClientLibraryIntegrity(data.clientLibraryIntegrity);
            setStep('checkout');
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Payment initiation failed');
            setStep('form');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = (transactionId: string) => {
        console.log('Payment successful! Transaction ID:', transactionId);
        setStep('success');
    };

    const handlePaymentError = (errorMsg: string) => {
        setError(errorMsg);
        setStep('failed');
    };

    const handleCancel = () => {
        setStep('form');
        setError('');
    };

    const resetForm = () => {
        setStep('form');
        setError('');
        setAmount('25');
    };

    if (step === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-green-600">Donation Successful!</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p>Thank you for your donation of <strong>${donationAmount.toFixed(2)}</strong></p>
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
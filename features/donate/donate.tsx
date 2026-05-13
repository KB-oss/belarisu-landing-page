// app/donate/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckCircle, XCircle, Clock, CreditCard, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// M-Pesa Constants
const DONATION_AMOUNTS = [100, 500, 1000, 2500, 5000];

// Cybersource Validation Schema
const cybersourceSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least KES 1').max(500000, 'Amount cannot exceed KES 500,000'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, 'Month must be 01-12'),
  expiryYear: z.string().regex(/^\d{4}$/, 'Year must be 4 digits').refine((year) => parseInt(year) >= new Date().getFullYear(), {
    message: 'Year must be current or future',
  }),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
  cardholderName: z.string().min(2, 'Cardholder name is required').max(100),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
});

type CybersourceFormData = z.infer<typeof cybersourceSchema>;

export default function DonatePage() {
  // M-Pesa States
  const [mpesaAmount, setMpesaAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isMpesaLoading, setIsMpesaLoading] = useState(false);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [mpesaStatus, setMpesaStatus] = useState<'idle' | 'pending' | 'completed' | 'failed' | 'timeout'>('idle');
  const [mpesaError, setMpesaError] = useState<string | null>(null);

  // Cybersource States
  const [isCybersourceLoading, setIsCybersourceLoading] = useState(false);
  const [cybersourceStatus, setCybersourceStatus] = useState<'idle' | 'pending' | 'completed' | 'failed'>('idle');
  const [cybersourceError, setCybersourceError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'mpesa' | 'cybersource'>('mpesa');

  // Cybersource Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetCybersourceForm,
    watch,
  } = useForm<CybersourceFormData>({
    resolver: zodResolver(cybersourceSchema),
    defaultValues: {
      amount: 0,
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardholderName: '',
      email: '',
      phone: '',
    },
  });

  const cybersourceAmount = watch('amount');

  // Poll for M-Pesa status updates
  useEffect(() => {
    if (!checkoutId || mpesaStatus !== 'pending') return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/mpesa/status?checkoutRequestId=${checkoutId}`);
      const data = await res.json();
      
      if (data.donation && data.donation.status !== 'pending') {
        setMpesaStatus(data.donation.status);
        setCheckoutId(null);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [checkoutId, mpesaStatus]);

  // M-Pesa Handlers
  const handleAmountSelect = (selectedAmount: number) => {
    setMpesaAmount(selectedAmount);
    setCustomAmount('');
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    if (value) {
      setMpesaAmount(parseFloat(value));
    }
  };

  const handleMpesaDonate = async () => {
    if (!mpesaAmount || mpesaAmount <= 0) {
      setMpesaError('Please enter a valid amount');
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      setMpesaError('Please enter a valid phone number');
      return;
    }

    setIsMpesaLoading(true);
    setMpesaError(null);
    setMpesaStatus('pending');

    try {
      const response = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: mpesaAmount,
          phoneNumber: phoneNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCheckoutId(data.checkoutRequestId);
      } else {
        setMpesaStatus('failed');
        setMpesaError(data.message || 'Payment initiation failed');
      }
    } catch (err) {
      setMpesaStatus('failed');
      setMpesaError('Network error. Please try again.');
    } finally {
      setIsMpesaLoading(false);
    }
  };

  const resetMpesaForm = () => {
    setMpesaStatus('idle');
    setCheckoutId(null);
    setMpesaError(null);
    setPhoneNumber('');
    setMpesaAmount(500);
    setCustomAmount('');
  };

  // Cybersource Handler
  const handleCybersourceDonate = async (data: CybersourceFormData) => {
    setIsCybersourceLoading(true);
    setCybersourceError(null);
    setCybersourceStatus('pending');

    try {
      const response = await fetch('/api/cybersource/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: data.amount,
          currency: 'KES',
          cardDetails: {
            number: data.cardNumber,
            expiryMonth: data.expiryMonth,
            expiryYear: data.expiryYear,
            cvv: data.cvv,
          },
          cardholderName: data.cardholderName,
          customer: {
            email: data.email,
            phone: data.phone,
          },
        }),
      });

      const result = await response.json();
      console.log(result, 'result');
      

      if (result.success) {
        setCybersourceStatus('completed');
        // Reset form after 3 seconds
        setTimeout(() => {
          resetCybersourceForm();
          setCybersourceStatus('idle');
        }, 3000);
      } else {
        setCybersourceStatus('failed');
        setCybersourceError(result.error || 'Payment failed. Please try again.');
      }
    } catch (err) {
      setCybersourceStatus('failed');
      setCybersourceError('Network error. Please try again.');
    } finally {
      setIsCybersourceLoading(false);
    }
  };

  const resetCybersourcePayment = () => {
    setCybersourceStatus('idle');
    setCybersourceError(null);
    resetCybersourceForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-indigo-700">
              Make a Donation
            </CardTitle>
            <CardDescription>
              Support our cause with M-Pesa or Credit/Debit Card
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'mpesa' | 'cybersource')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="mpesa" className="text-lg">
                  M-Pesa
                </TabsTrigger>
                <TabsTrigger value="cybersource" className="text-lg">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Card Payment
                </TabsTrigger>
              </TabsList>

              {/* M-Pesa Tab - UNCHANGED */}
              <TabsContent value="mpesa" className="space-y-6">
                {mpesaStatus === 'idle' && (
                  <>
                    {/* Amount Selection */}
                    <div className="space-y-3">
                      <Label>Select Amount (KES)</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {DONATION_AMOUNTS.map((amt) => (
                          <Button
                            key={amt}
                            variant={mpesaAmount === amt && !customAmount ? 'default' : 'outline'}
                            onClick={() => handleAmountSelect(amt)}
                            className="w-full"
                          >
                            KES {amt.toLocaleString()}
                          </Button>
                        ))}
                      </div>
                      
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="Custom amount"
                          value={customAmount}
                          onChange={(e) => handleCustomAmount(e.target.value)}
                          className="pl-8"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          KES
                        </span>
                      </div>
                    </div>

                    {/* Phone Number Input */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">M-Pesa Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="0712345678 or 254712345678"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        Enter the phone number registered with M-Pesa
                      </p>
                    </div>

                    {/* Error Alert */}
                    {mpesaError && (
                      <Alert variant="destructive">
                        <AlertDescription>{mpesaError}</AlertDescription>
                      </Alert>
                    )}

                    {/* Donate Button */}
                    <Button
                      onClick={handleMpesaDonate}
                      disabled={isMpesaLoading}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      {isMpesaLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Donate KES ${mpesaAmount.toLocaleString()}`
                      )}
                    </Button>
                  </>
                )}

                {/* M-Pesa Pending Status */}
                {mpesaStatus === 'pending' && (
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="animate-ping absolute inset-0 bg-yellow-400 rounded-full opacity-75"></div>
                        <Clock className="h-16 w-16 text-yellow-600 relative" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold">Waiting for Payment</h3>
                    <p className="text-gray-600">
                      Please check your phone and enter your M-Pesa PIN to complete the donation.
                    </p>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> In sandbox mode, you won't receive a real M-Pesa prompt. 
                        This is a simulation. The transaction will auto-complete in a few seconds.
                      </p>
                    </div>
                    <Button variant="outline" onClick={resetMpesaForm} className="w-full">
                      Cancel
                    </Button>
                  </div>
                )}

                {/* M-Pesa Success Status */}
                {mpesaStatus === 'completed' && (
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <CheckCircle className="h-16 w-16 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-700">Donation Successful!</h3>
                    <p className="text-gray-600">
                      Thank you for your donation of <strong>KES {mpesaAmount.toLocaleString()}</strong>
                    </p>
                    <p className="text-sm text-gray-500">
                      A receipt has been sent to {phoneNumber}
                    </p>
                    <Button onClick={resetMpesaForm} className="w-full">
                      Make Another Donation
                    </Button>
                  </div>
                )}

                {/* M-Pesa Failed Status */}
                {(mpesaStatus === 'failed' || mpesaStatus === 'timeout') && (
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <XCircle className="h-16 w-16 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-red-700">
                      {mpesaStatus === 'timeout' ? 'Payment Timeout' : 'Payment Failed'}
                    </h3>
                    <p className="text-gray-600">
                      {mpesaError || 'The transaction could not be completed. Please try again.'}
                    </p>
                    <Button onClick={resetMpesaForm} className="w-full">
                      Try Again
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Cybersource Tab - NEW */}
              <TabsContent value="cybersource" className="space-y-6">
                {cybersourceStatus === 'idle' && (
                  <form onSubmit={handleSubmit(handleCybersourceDonate)} className="space-y-4">
                    {/* Amount Field */}
                    <div className="space-y-2">
                      <Label htmlFor="cs_amount">Donation Amount (KES)</Label>
                      <Input
                        id="cs_amount"
                        type="number"
                        placeholder="500"
                        {...register('amount', { valueAsNumber: true })}
                        className={errors.amount ? 'border-red-500' : ''}
                      />
                      {errors.amount && (
                        <p className="text-sm text-red-500">{errors.amount.message}</p>
                      )}
                    </div>

                    {/* Cardholder Name */}
                    <div className="space-y-2">
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input
                        id="cardholderName"
                        placeholder="John Doe"
                        {...register('cardholderName')}
                        className={errors.cardholderName ? 'border-red-500' : ''}
                      />
                      {errors.cardholderName && (
                        <p className="text-sm text-red-500">{errors.cardholderName.message}</p>
                      )}
                    </div>

                    {/* Card Number */}
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="4111 1111 1111 1111"
                        {...register('cardNumber')}
                        className={errors.cardNumber ? 'border-red-500' : ''}
                      />
                      {errors.cardNumber && (
                        <p className="text-sm text-red-500">{errors.cardNumber.message}</p>
                      )}
                    </div>

                    {/* Expiry & CVV Row */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryMonth">Month</Label>
                        <Input
                          id="expiryMonth"
                          placeholder="12"
                          maxLength={2}
                          {...register('expiryMonth')}
                          className={errors.expiryMonth ? 'border-red-500' : ''}
                        />
                        {errors.expiryMonth && (
                          <p className="text-xs text-red-500">{errors.expiryMonth.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiryYear">Year</Label>
                        <Input
                          id="expiryYear"
                          placeholder="2028"
                          maxLength={4}
                          {...register('expiryYear')}
                          className={errors.expiryYear ? 'border-red-500' : ''}
                        />
                        {errors.expiryYear && (
                          <p className="text-xs text-red-500">{errors.expiryYear.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          type="password"
                          placeholder="123"
                          maxLength={4}
                          {...register('cvv')}
                          className={errors.cvv ? 'border-red-500' : ''}
                        />
                        {errors.cvv && (
                          <p className="text-xs text-red-500">{errors.cvv.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (for receipt)</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="donor@example.com"
                        {...register('email')}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="cs_phone">Phone Number</Label>
                      <Input
                        id="cs_phone"
                        type="tel"
                        placeholder="254712345678"
                        {...register('phone')}
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Security Notice */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                      <Lock className="h-4 w-4" />
                      <span>Your payment is secure and encrypted. Card details are never stored.</span>
                    </div>

                    {/* Error Alert */}
                    {cybersourceError && (
                      <Alert variant="destructive">
                        <AlertDescription>{cybersourceError}</AlertDescription>
                      </Alert>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isCybersourceLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      {isCybersourceLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Donate KES {(cybersourceAmount || 0).toLocaleString()}
                        </>
                      )}
                    </Button>
                  </form>
                )}

                {/* Cybersource Pending Status */}
                {cybersourceStatus === 'pending' && (
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="animate-ping absolute inset-0 bg-blue-400 rounded-full opacity-75"></div>
                        <Loader2 className="h-16 w-16 text-blue-600 relative animate-spin" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold">Processing Payment</h3>
                    <p className="text-gray-600">
                      Please wait while we process your card payment...
                    </p>
                    <Button variant="outline" onClick={resetCybersourcePayment} className="w-full">
                      Cancel
                    </Button>
                  </div>
                )}

                {/* Cybersource Success Status */}
                {cybersourceStatus === 'completed' && (
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <CheckCircle className="h-16 w-16 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-700">Donation Successful!</h3>
                    <p className="text-gray-600">
                      Thank you for your donation of <strong>KES {watch('amount')?.toLocaleString()}</strong>
                    </p>
                    <p className="text-sm text-gray-500">
                      A receipt has been sent to your email.
                    </p>
                  </div>
                )}

                {/* Cybersource Failed Status */}
                {cybersourceStatus === 'failed' && (
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <XCircle className="h-16 w-16 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-red-700">Payment Failed</h3>
                    <p className="text-gray-600">
                      {cybersourceError || 'The transaction could not be completed. Please try again.'}
                    </p>
                    <Button onClick={resetCybersourcePayment} className="w-full">
                      Try Again
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
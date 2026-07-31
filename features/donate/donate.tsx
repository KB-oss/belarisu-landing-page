// // app/donate/page.tsx - COMPLETE FIXED VERSION
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Loader2, CheckCircle, XCircle, Clock, CreditCard, Lock } from 'lucide-react';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';

// declare global {
//   interface Window {
//     Cybersource?: any;
//     jQuery?: any;
//   }
// }

// // M-Pesa Constants
// const DONATION_AMOUNTS = [100, 500, 1000, 2500, 5000];

// // Cybersource Form Schema
// const cybersourceSchema = z.object({
//   amount: z.number().min(1, 'Amount must be at least USD 1').max(50000, 'Amount cannot exceed USD 50,000'),
//   email: z.string().email('Valid email is required'),
//   phone: z.string().min(10, 'Valid phone number is required'),
//   name: z.string().min(2, 'Name is required'),
// });

// type CybersourceFormData = z.infer<typeof cybersourceSchema>;

// export default function DonatePage() {
//   // M-Pesa States
//   const [mpesaAmount, setMpesaAmount] = useState<number>(500);
//   const [customAmount, setCustomAmount] = useState<string>('');
//   const [phoneNumber, setPhoneNumber] = useState<string>('');
//   const [isMpesaLoading, setIsMpesaLoading] = useState(false);
//   const [checkoutId, setCheckoutId] = useState<string | null>(null);
//   const [mpesaStatus, setMpesaStatus] = useState<'idle' | 'pending' | 'completed' | 'failed' | 'timeout'>('idle');
//   const [mpesaError, setMpesaError] = useState<string | null>(null);

//   // Cybersource States
//   const [isCybersourceLoading, setIsCybersourceLoading] = useState(false);
//   const [cybersourceStatus, setCybersourceStatus] = useState<'idle' | 'pending' | 'completed' | 'failed'>('idle');
//   const [cybersourceError, setCybersourceError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<'mpesa' | 'cybersource'>('mpesa');
//   const [captureContext, setCaptureContext] = useState<string | null>(null);
//   const [showPaymentWidget, setShowPaymentWidget] = useState(false);
//   const paymentContainerRef = useRef<HTMLDivElement>(null);
//   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

//   // Cybersource Form
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset: resetCybersourceForm,
//     watch,
//   } = useForm<CybersourceFormData>({
//     resolver: zodResolver(cybersourceSchema),
//     defaultValues: {
//       amount: 100,
//       email: '',
//       phone: '',
//       name: '',
//     },
//   });

//   const cybersourceAmount = watch('amount');

//   // Cleanup polling on unmount
//   useEffect(() => {
//     return () => {
//       if (pollingIntervalRef.current) {
//         clearInterval(pollingIntervalRef.current);
//       }
//     };
//   }, []);

//   // Poll for Cybersource payment status
//   const startPolling = (transactionId: string) => {
//     if (pollingIntervalRef.current) {
//       clearInterval(pollingIntervalRef.current);
//     }
    
//     pollingIntervalRef.current = setInterval(async () => {
//       try {
//         const response = await fetch(`/api/cybersource/status?transactionId=${transactionId}`);
//         const data = await response.json();
        
//         if (data.exists && data.status !== 'pending') {
//           if (data.status === 'completed') {
//             setCybersourceStatus('completed');
//             setShowPaymentWidget(false);
//             setCaptureContext(null);
//           } else if (data.status === 'failed') {
//             setCybersourceStatus('failed');
//             setCybersourceError('Payment was declined. Please try again.');
//             setShowPaymentWidget(false);
//             setCaptureContext(null);
//           }
          
//           if (pollingIntervalRef.current) {
//             clearInterval(pollingIntervalRef.current);
//             pollingIntervalRef.current = null;
//           }
//           setIsCybersourceLoading(false);
//         }
//       } catch (error) {
//         console.error('Polling error:', error);
//       }
//     }, 3000);
//   };

//   // Load Cybersource SDK and render widget when captureContext is available
//   useEffect(() => {
//     if (!captureContext || !showPaymentWidget) return;
    
//     const loadAndRenderWidget = async () => {
//       // Wait for SDK to be available
//       if (!window.Cybersource) {
//         // Load jQuery if not already loaded
//         if (!window.jQuery) {
//           const jqueryScript = document.createElement('script');
//           jqueryScript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
//           jqueryScript.async = true;
//           document.body.appendChild(jqueryScript);
//           await new Promise(resolve => { jqueryScript.onload = resolve; });
//         }
        
//         // Load Cybersource SDK
//         const cybScript = document.createElement('script');
//         cybScript.src = 'https://src.cybersource.com/cybersource-sa-client.js';
//         cybScript.async = true;
//         document.body.appendChild(cybScript);
//         await new Promise(resolve => { cybScript.onload = resolve; });
//       }
      
//       // Small delay to ensure DOM is ready
//       setTimeout(() => {
//         if (paymentContainerRef.current && window.Cybersource) {
//           renderWidget();
//         }
//       }, 100);
//     };
    
//     const renderWidget = () => {
//       const container = paymentContainerRef.current;
//       if (!container || !window.Cybersource) return;
//       container.innerHTML = '';

//       const paymentConfig = {
//         captureContext: captureContext,
//         onSuccess: (response: { transactionId: string }) => {
//           console.log('Payment successful:', response);
//           startPolling(response.transactionId);
//         },
//         onError: (error: { message: string }) => {
//           console.error('Payment error:', error);
//           setCybersourceStatus('failed');
//           setCybersourceError(error.message || 'Payment failed');
//           setIsCybersourceLoading(false);
//           setShowPaymentWidget(false);
//           setCaptureContext(null);
//         },
//         onCancel: () => {
//           console.log('Payment cancelled');
//           setCybersourceStatus('failed');
//           setCybersourceError('Payment was cancelled');
//           setIsCybersourceLoading(false);
//           setShowPaymentWidget(false);
//           setCaptureContext(null);
//         },
//         onLoad: () => {
//           console.log('Payment widget loaded');
//           setIsCybersourceLoading(false);
//         }
//       };
      
//       try {
//         const paymentInstance = new window.Cybersource.Payment(paymentConfig);
//         paymentInstance.render(container);
//       } catch (err) {
//         console.error('Failed to render widget:', err);
//         setCybersourceStatus('failed');
//         setCybersourceError('Failed to load payment form');
//         setIsCybersourceLoading(false);
//         setShowPaymentWidget(false);
//         setCaptureContext(null);
//       }
//     };
    
//     loadAndRenderWidget();
//   }, [captureContext, showPaymentWidget]);

//   // M-Pesa Handlers
//   const handleAmountSelect = (selectedAmount: number) => {
//     setMpesaAmount(selectedAmount);
//     setCustomAmount('');
//   };

//   const handleCustomAmount = (value: string) => {
//     setCustomAmount(value);
//     if (value) {
//       setMpesaAmount(parseFloat(value));
//     }
//   };

//   const handleMpesaDonate = async () => {
//     if (!mpesaAmount || mpesaAmount <= 0) {
//       setMpesaError('Please enter a valid amount');
//       return;
//     }

//     if (!phoneNumber || phoneNumber.length < 10) {
//       setMpesaError('Please enter a valid phone number');
//       return;
//     }

//     setIsMpesaLoading(true);
//     setMpesaError(null);
//     setMpesaStatus('pending');

//     try {
//       const response = await fetch('/api/mpesa/stkpush', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           amount: mpesaAmount,
//           phoneNumber: phoneNumber,
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         setCheckoutId(data.checkoutRequestId);
//       } else {
//         setMpesaStatus('failed');
//         setMpesaError(data.message || 'Payment initiation failed');
//       }
//     } catch (err) {
//       setMpesaStatus('failed');
//       setMpesaError('Network error. Please try again.');
//     } finally {
//       setIsMpesaLoading(false);
//     }
//   };

//   const resetMpesaForm = () => {
//     setMpesaStatus('idle');
//     setCheckoutId(null);
//     setMpesaError(null);
//     setPhoneNumber('');
//     setMpesaAmount(500);
//     setCustomAmount('');
//   };

//   // Cybersource Handler - THIS CALLS THE API
//   const handleCybersourceDonate = async (data: CybersourceFormData) => {
//     console.log('=== Cybersource Donation Started ===');
//     console.log('Form data:', data);
    
//     setIsCybersourceLoading(true);
//     setCybersourceError(null);
//     setCybersourceStatus('pending');

//     try {
//       console.log('Calling /api/cybersource/session...');
//       const sessionResponse = await fetch('/api/cybersource/session', {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           amount: data.amount,
//           currency: 'USD',
//           donorEmail: data.email,
//           donorName: data.name,
//           donorPhone: data.phone,
//         }),
//       });

//       console.log('Session response status:', sessionResponse.status);
//       const sessionData = await sessionResponse.json();
//       console.log('Session response data:', sessionData);

//       if (!sessionResponse.ok || !sessionData.success) {
//         throw new Error(sessionData.error || 'Failed to initialize payment session');
//       }

//       if (!sessionData.captureContext) {
//         throw new Error('No capture context received from Cybersource');
//       }

//       console.log('Capture context received, showing payment widget...');
//       setCaptureContext(sessionData.captureContext);
//       setShowPaymentWidget(true);
      
//     } catch (err) {
//       console.error('Cybersource error:', err);
//       const errorMessage = err instanceof Error ? err.message : 'Payment initialization failed';
//       setCybersourceStatus('failed');
//       setCybersourceError(errorMessage);
//       setIsCybersourceLoading(false);
//     }
//   };

//   const resetCybersourcePayment = () => {
//     if (pollingIntervalRef.current) {
//       clearInterval(pollingIntervalRef.current);
//       pollingIntervalRef.current = null;
//     }
    
//     setCybersourceStatus('idle');
//     setCybersourceError(null);
//     setCaptureContext(null);
//     setShowPaymentWidget(false);
//     resetCybersourceForm();
//     setIsCybersourceLoading(false);
    
//     if (paymentContainerRef.current) {
//       paymentContainerRef.current.innerHTML = '';
//     }
//   };

//   // M-Pesa polling effect
//   useEffect(() => {
//     if (!checkoutId || mpesaStatus !== 'pending') return;

//     const interval = setInterval(async () => {
//       const res = await fetch(`/api/mpesa/status?checkoutRequestId=${checkoutId}`);
//       const data = await res.json();
      
//       if (data.donation && data.donation.status !== 'pending') {
//         setMpesaStatus(data.donation.status);
//         setCheckoutId(null);
//         clearInterval(interval);
//       }
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [checkoutId, mpesaStatus]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
//       <div className="max-w-md mx-auto">
//         <Card className="shadow-xl">
//           <CardHeader className="text-center">
//             <CardTitle className="text-3xl font-bold text-indigo-700">
//               Make a Donation
//             </CardTitle>
//             <CardDescription>
//               Support our cause with M-Pesa or Credit/Debit Card
//             </CardDescription>
//           </CardHeader>
          
//           <CardContent>
//             <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'mpesa' | 'cybersource')} className="w-full">
//               <TabsList className="grid w-full grid-cols-2 mb-6">
//                 <TabsTrigger value="mpesa" className="text-lg">
//                   M-Pesa
//                 </TabsTrigger>
//                 <TabsTrigger value="cybersource" className="text-lg">
//                   <CreditCard className="mr-2 h-4 w-4" />
//                   Card Payment
//                 </TabsTrigger>
//               </TabsList>

//               {/* M-Pesa Tab - UNCHANGED */}
//               <TabsContent value="mpesa" className="space-y-6">
//                 {mpesaStatus === 'idle' && (
//                   <>
//                     <div className="space-y-3">
//                       <Label>Select Amount (KES)</Label>
//                       <div className="grid grid-cols-3 gap-2">
//                         {DONATION_AMOUNTS.map((amt) => (
//                           <Button
//                             key={amt}
//                             variant={mpesaAmount === amt && !customAmount ? 'default' : 'outline'}
//                             onClick={() => handleAmountSelect(amt)}
//                             className="w-full"
//                           >
//                             KES {amt.toLocaleString()}
//                           </Button>
//                         ))}
//                       </div>
//                       <div className="relative">
//                         <Input
//                           type="number"
//                           placeholder="Custom amount"
//                           value={customAmount}
//                           onChange={(e) => handleCustomAmount(e.target.value)}
//                           className="pl-8"
//                         />
//                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
//                           KES
//                         </span>
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="phone">M-Pesa Phone Number</Label>
//                       <Input
//                         id="phone"
//                         type="tel"
//                         placeholder="0712345678 or 254712345678"
//                         value={phoneNumber}
//                         onChange={(e) => setPhoneNumber(e.target.value)}
//                       />
//                       <p className="text-xs text-gray-500">
//                         Enter the phone number registered with M-Pesa
//                       </p>
//                     </div>

//                     {mpesaError && (
//                       <Alert variant="destructive">
//                         <AlertDescription>{mpesaError}</AlertDescription>
//                       </Alert>
//                     )}

//                     <Button
//                       onClick={handleMpesaDonate}
//                       disabled={isMpesaLoading}
//                       className="w-full bg-green-600 hover:bg-green-700"
//                       size="lg"
//                     >
//                       {isMpesaLoading ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           Processing...
//                         </>
//                       ) : (
//                         `Donate KES ${mpesaAmount.toLocaleString()}`
//                       )}
//                     </Button>
//                   </>
//                 )}

//                 {mpesaStatus === 'pending' && (
//                   <div className="text-center space-y-4">
//                     <div className="flex justify-center">
//                       <div className="relative">
//                         <div className="animate-ping absolute inset-0 bg-yellow-400 rounded-full opacity-75"></div>
//                         <Clock className="h-16 w-16 text-yellow-600 relative" />
//                       </div>
//                     </div>
//                     <h3 className="text-xl font-semibold">Waiting for Payment</h3>
//                     <p className="text-gray-600">
//                       Please check your phone and enter your M-Pesa PIN to complete the donation.
//                     </p>
//                     <div className="bg-yellow-50 p-4 rounded-lg">
//                       <p className="text-sm text-yellow-800">
//                         <strong>Note:</strong> In sandbox mode, you won't receive a real M-Pesa prompt. 
//                         This is a simulation. The transaction will auto-complete in a few seconds.
//                       </p>
//                     </div>
//                     <Button variant="outline" onClick={resetMpesaForm} className="w-full">
//                       Cancel
//                     </Button>
//                   </div>
//                 )}

//                 {mpesaStatus === 'completed' && (
//                   <div className="text-center space-y-4">
//                     <div className="flex justify-center">
//                       <CheckCircle className="h-16 w-16 text-green-600" />
//                     </div>
//                     <h3 className="text-2xl font-bold text-green-700">Donation Successful!</h3>
//                     <p className="text-gray-600">
//                       Thank you for your donation of <strong>KES {mpesaAmount.toLocaleString()}</strong>
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       A receipt has been sent to {phoneNumber}
//                     </p>
//                     <Button onClick={resetMpesaForm} className="w-full">
//                       Make Another Donation
//                     </Button>
//                   </div>
//                 )}

//                 {(mpesaStatus === 'failed' || mpesaStatus === 'timeout') && (
//                   <div className="text-center space-y-4">
//                     <div className="flex justify-center">
//                       <XCircle className="h-16 w-16 text-red-600" />
//                     </div>
//                     <h3 className="text-2xl font-bold text-red-700">
//                       {mpesaStatus === 'timeout' ? 'Payment Timeout' : 'Payment Failed'}
//                     </h3>
//                     <p className="text-gray-600">
//                       {mpesaError || 'The transaction could not be completed. Please try again.'}
//                     </p>
//                     <Button onClick={resetMpesaForm} className="w-full">
//                       Try Again
//                     </Button>
//                   </div>
//                 )}
//               </TabsContent>

//               {/* Cybersource Tab - FIXED */}
//               <TabsContent value="cybersource" className="space-y-6">
//                 {/* Show form when idle and no widget shown */}
//                 {cybersourceStatus === 'idle' && !showPaymentWidget && (
//                   <form onSubmit={handleSubmit(handleCybersourceDonate)} className="space-y-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="cs_amount">Donation Amount (USD)</Label>
//                       <Input
//                         id="cs_amount"
//                         type="number"
//                         placeholder="100"
//                         {...register('amount', { valueAsNumber: true })}
//                         className={errors.amount ? 'border-red-500' : ''}
//                       />
//                       {errors.amount && (
//                         <p className="text-sm text-red-500">{errors.amount.message}</p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="cs_name">Full Name</Label>
//                       <Input
//                         id="cs_name"
//                         placeholder="John Doe"
//                         {...register('name')}
//                         className={errors.name ? 'border-red-500' : ''}
//                       />
//                       {errors.name && (
//                         <p className="text-sm text-red-500">{errors.name.message}</p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="cs_email">Email (for receipt)</Label>
//                       <Input
//                         id="cs_email"
//                         type="email"
//                         placeholder="donor@example.com"
//                         {...register('email')}
//                         className={errors.email ? 'border-red-500' : ''}
//                       />
//                       {errors.email && (
//                         <p className="text-sm text-red-500">{errors.email.message}</p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="cs_phone">Phone Number</Label>
//                       <Input
//                         id="cs_phone"
//                         type="tel"
//                         placeholder="+254712345678"
//                         {...register('phone')}
//                         className={errors.phone ? 'border-red-500' : ''}
//                       />
//                       {errors.phone && (
//                         <p className="text-sm text-red-500">{errors.phone.message}</p>
//                       )}
//                     </div>

//                     <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
//                       <Lock className="h-4 w-4" />
//                       <span>Your payment is secure and encrypted. Card details are never stored.</span>
//                     </div>

//                     {cybersourceError && (
//                       <Alert variant="destructive">
//                         <AlertDescription>{cybersourceError}</AlertDescription>
//                       </Alert>
//                     )}

//                     <Button
//                       type="submit"
//                       disabled={isCybersourceLoading}
//                       className="w-full bg-blue-600 hover:bg-blue-700"
//                       size="lg"
//                     >
//                       {isCybersourceLoading ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           Initializing...
//                         </>
//                       ) : (
//                         <>
//                           <CreditCard className="mr-2 h-4 w-4" />
//                           Donate ${cybersourceAmount || 0}
//                         </>
//                       )}
//                     </Button>
//                   </form>
//                 )}

//                 {/* Show payment widget when captureContext is available */}
//                 {showPaymentWidget && captureContext && (
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <h3 className="font-semibold">Enter Card Details</h3>
//                         <p className="text-sm text-gray-500">
//                           Amount: <span className="font-bold">${cybersourceAmount}</span>
//                         </p>
//                       </div>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={resetCybersourcePayment}
//                       >
//                         Cancel
//                       </Button>
//                     </div>
                    
//                     <div ref={paymentContainerRef} className="min-h-[400px] w-full border rounded-lg p-4" />
                    
//                     {isCybersourceLoading && (
//                       <div className="flex items-center justify-center py-4">
//                         <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
//                         <span className="ml-2 text-gray-500">Loading secure payment form...</span>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {cybersourceStatus === 'completed' && (
//                   <div className="text-center space-y-4">
//                     <div className="flex justify-center">
//                       <CheckCircle className="h-16 w-16 text-green-600" />
//                     </div>
//                     <h3 className="text-2xl font-bold text-green-700">Donation Successful!</h3>
//                     <p className="text-gray-600">
//                       Thank you for your donation of <strong>USD {cybersourceAmount?.toLocaleString()}</strong>
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       A receipt has been sent to your email.
//                     </p>
//                     <Button onClick={resetCybersourcePayment} className="w-full">
//                       Make Another Donation
//                     </Button>
//                   </div>
//                 )}

//                 {cybersourceStatus === 'failed' && !showPaymentWidget && (
//                   <div className="text-center space-y-4">
//                     <div className="flex justify-center">
//                       <XCircle className="h-16 w-16 text-red-600" />
//                     </div>
//                     <h3 className="text-2xl font-bold text-red-700">Payment Failed</h3>
//                     <p className="text-gray-600">
//                       {cybersourceError || 'The transaction could not be completed. Please try again.'}
//                     </p>
//                     <Button onClick={resetCybersourcePayment} className="w-full">
//                       Try Again
//                     </Button>
//                   </div>
//                 )}
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
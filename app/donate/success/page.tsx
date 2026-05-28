// app/donation/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function DonationSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const transactionId = searchParams.get('transactionId');
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <CardTitle className="text-2xl font-bold text-green-700">Donation Successful!</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p>Thank you for your generous donation.</p>
                    {transactionId && <p className="text-sm text-gray-500">Transaction ID: {transactionId}</p>}
                    <Button onClick={() => router.push('/')} className="w-full">Return Home</Button>
                </CardContent>
            </Card>
        </div>
    );
}
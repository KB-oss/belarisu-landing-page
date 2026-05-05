import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const checkoutRequestId = searchParams.get('checkoutRequestId');

        if (!checkoutRequestId) {
            return NextResponse.json(
                { error: 'checkoutRequestId is required' },
                { status: 400 }
            );
        }
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('donations')
            .select('*')
            .eq('checkout_request_id', checkoutRequestId)
            .single();

        if (error) {
            return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
        }

        return NextResponse.json({ donation: data });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
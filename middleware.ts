// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    console.log('✅ MIDDLEWARE IS RUNNING for:', request.nextUrl.pathname);

    const response = NextResponse.next();
    const pathname = request.nextUrl.pathname;

    const host = request.headers.get('host') || '';
    const isProduction = host.includes('vercel.app') || !host.includes('localhost');
    const targetOrigin = isProduction
        ? 'https://belarisu-landing-page-liard.vercel.app'
        : 'http://localhost:3000';

    console.log('Pathname:', pathname);
    console.log('isProduction:', isProduction);
    console.log('targetOrigin:', targetOrigin);

    const shouldApplyCSP =
        !pathname.startsWith('/api') &&
        !pathname.startsWith('/_next/static') &&
        !pathname.includes('.');

    console.log('shouldApplyCSP:', shouldApplyCSP);

    if (shouldApplyCSP) {
        const cspHeader = [
            "default-src * 'unsafe-inline' 'unsafe-eval' 'unsafe-hashes'",
            "script-src * 'unsafe-inline' 'unsafe-eval' 'unsafe-hashes'",
            "style-src * 'unsafe-inline' 'unsafe-hashes'",
            "img-src * data:",
            "font-src * data:",
            "frame-src *",
            "connect-src *",
            "frame-ancestors *",
            "base-uri *",
            "form-action *"
        ].join('; ');

        console.log('Setting CSP header:', cspHeader.substring(0, 100) + '...');
        response.headers.set('Content-Security-Policy', cspHeader);
    } else {
        console.log('NOT setting CSP header for this path');
    }

    return response;
}

export const config = {
    matcher: '/((?!_next/static|_next/image|favicon.ico|api).*)',
};
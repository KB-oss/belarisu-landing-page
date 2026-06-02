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
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: data:",
            "style-src 'self' 'unsafe-inline' https: data:",
            "font-src 'self' data: https:",
            "img-src 'self' data: https:",
            `frame-src 'self' ${targetOrigin} https:`,
            `connect-src 'self' ${targetOrigin} https:`,
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
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
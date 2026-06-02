// middleware.ts - Allow all HTTPS sites for styles
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const pathname = request.nextUrl.pathname;
    
    const host = request.headers.get('host') || '';
    const isProduction = host.includes('vercel.app') || !host.includes('localhost');
    const targetOrigin = isProduction 
        ? 'https://belarisu-landing-page-liard.vercel.app'
        : 'http://localhost:3000';
    
    const shouldApplyCSP = 
        !pathname.startsWith('/api') && 
        !pathname.startsWith('/_next/static') &&
        !pathname.includes('.');
    
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
        
        response.headers.set('Content-Security-Policy', cspHeader);
    }
    
    return response;
}

export const config = {
    matcher: '/((?!_next/static|_next/image|favicon.ico|api).*)',
};
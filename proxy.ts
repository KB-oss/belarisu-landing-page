// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
    const response = NextResponse.next();
    const pathname = request.nextUrl.pathname;
    
    const shouldApplyCSP = 
        !pathname.startsWith('/api') && 
        !pathname.startsWith('/_next/static') &&
        !pathname.includes('.');
    
    if (shouldApplyCSP) {
        const cspHeader = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.cybersource.com https://*.googleapis.com https://*.gstatic.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' data: https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "frame-src 'self' https://*.cybersource.com",
            "connect-src 'self' https://*.cybersource.com https://*.vercel.app",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ].join('; ');
        
        response.headers.set('Content-Security-Policy', cspHeader);
    }
    
    return response;
}

export const config = {
    matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
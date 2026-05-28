// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
    const response = NextResponse.next();
    
    // Only apply CSP to page routes, not API routes
    if (!request.nextUrl.pathname.startsWith('/api')) {
        const cspHeader = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.cybersource.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' data:",
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
    matcher: '/((?!_next/static|_next/image|favicon.ico|api).*)',
};
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const pathname = request.nextUrl.pathname;
    
    // Generate a random nonce for each request
    const nonce = randomBytes(16).toString('base64');
    
    const shouldApplyCSP = 
        !pathname.startsWith('/api') && 
        !pathname.startsWith('/_next/static') &&
        !pathname.includes('.');
    
    if (shouldApplyCSP) {
        // Most permissive CSP - includes everything
        const cspHeader = [
            "default-src * 'unsafe-inline' 'unsafe-eval' 'unsafe-hashes' data: blob:",
            "script-src * 'unsafe-inline' 'unsafe-eval' 'unsafe-hashes' 'wasm-unsafe-eval'",
            "style-src * 'unsafe-inline' 'unsafe-hashes'",
            "img-src * data: blob:",
            "font-src * data:",
            "frame-src *",
            "connect-src *",
            "media-src *",
            "object-src *",
            "worker-src *",
            "frame-ancestors *",
            "base-uri *",
            "form-action *"
        ].join('; ');
        
        response.headers.set('Content-Security-Policy', cspHeader);
        
        // Also set the nonce for scripts
        response.headers.set('X-Content-Security-Policy-Nonce', nonce);
    }
    
    return response;
}

export const config = {
    matcher: '/((?!_next/static|_next/image|favicon.ico|api).*)',
};
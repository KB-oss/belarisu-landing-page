// proxy.ts - Place in project root (same level as package.json)
import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
    const response = NextResponse.next();
    const pathname = request.nextUrl.pathname;

    // Get the hostname to determine environment
    const host = request.headers.get('host') || '';
    const isProduction = host.includes('vercel.app') || !host.includes('localhost');

    // Set target origin based on environment
    const targetOrigin = isProduction
        ? 'https://belarisu-landing-page-liard.vercel.app'
        : 'http://localhost:3000';

    // Only apply CSP to page routes, not API routes or static files
    const shouldApplyCSP =
        !pathname.startsWith('/api') &&
        !pathname.startsWith('/_next/static') &&
        !pathname.includes('.');

    if (shouldApplyCSP) {
        const cspHeader = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.cybersource.com https://*.googleapis.com https://*.gstatic.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.cybersource.com https://*.cybersource.net",
            "font-src 'self' data: https://fonts.gstatic.com https://*.cybersource.com",
            "img-src 'self' data: https: https://*.cybersource.com",
            `frame-src 'self' https://*.cybersource.com https://*.cybersource.net ${targetOrigin}`,
            `connect-src 'self' https://*.cybersource.com https://*.cybersource.net ${targetOrigin}`,
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
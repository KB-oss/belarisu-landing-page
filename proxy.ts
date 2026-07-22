// proxy.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export function proxy(request: NextRequest) {
    const response = NextResponse.next();
    const pathname = request.nextUrl.pathname;

    // Only apply CSP to the checkout page
    if (pathname === '/cyper') {
        // Generate a new nonce for each request
        const nonce = crypto.randomBytes(16).toString('base64');
        // const nonce = '12345';

        const cspHeader = [
            "default-src 'self'",
            `script-src 'self' 'nonce-${nonce}' https://setup.cybersource.com https://testflex.cybersource.com https://*.cybersource.com https://*.online-metrix.net https://*.cardinalcommerce.com https://*.googleapis.com https://*.gstatic.com`,
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.cybersource.com",
            "font-src 'self' data: https://fonts.gstatic.com https://*.cybersource.com",
            "frame-src 'self' https://*.cybersource.com https://*.online-metrix.net https://*.cardinalcommerce.com",
            "connect-src 'self' https://*.cybersource.com https://*.online-metrix.net https://*.cardinalcommerce.com",
            "img-src 'self' data: https://*.cybersource.com https://*.online-metrix.net"
        ].join('; ');
        response.headers.set('Content-Security-Policy', cspHeader);

        // Store nonce in response headers so it can be used in the page
        response.headers.set('x-nonce', nonce);
    }

    return response;
}

export const config = {
    matcher: '/cyper',
};
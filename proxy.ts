// proxy.ts
import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    const isDev = process.env.NODE_ENV === 'development';

    const cspHeader = [
        "default-src 'self'",
        // 'strict-dynamic' lets the nonce-trusted CyberSource SDK inject its own child scripts.
        // 'unsafe-eval' is only needed in dev for React's error overlays.
        // We include Google domains for analytics, fonts, and scripts on other pages.
        `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''} https://setup.cybersource.com https://testflex.cybersource.com https://*.cybersource.com https://*.online-metrix.net https://*.cardinalcommerce.com https://*.googleapis.com https://*.gstatic.com`,
        // 'unsafe-inline' required for CyberSource Unified Checkout which applies inline styles
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.cybersource.com",
        "font-src 'self' data: https://fonts.gstatic.com https://*.cybersource.com",
        // Allow CyberSource iframe and device fingerprint iframes
        "frame-src 'self' https://*.cybersource.com https://*.online-metrix.net https://*.cardinalcommerce.com https://testflex.cybersource.com https://setup.cybersource.com",
        // Allow XHR/fetch to CyberSource APIs
        "connect-src 'self' https://*.cybersource.com https://*.online-metrix.net https://*.cardinalcommerce.com https://testflex.cybersource.com https://setup.cybersource.com",
        // Allow images, including Cloudinary images used across the site
        "img-src 'self' data: blob: https://*.cybersource.com https://*.online-metrix.net https://res.cloudinary.com",
        // CyberSource SDK uses web workers in blob URL environments
        "child-src 'self' blob: https://*.cybersource.com",
        "object-src 'none'",
        "base-uri 'self'",
    ].join('; ');

    // IMPORTANT: The nonce must be forwarded on the *request* headers so that
    // Next.js server components can read it via `headers().get('x-nonce')`.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('Content-Security-Policy', cspHeader);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    // Also set the CSP on the response so the browser enforces it
    response.headers.set('Content-Security-Policy', cspHeader);
    // Expose the nonce on the response header too (for debugging)
    response.headers.set('x-nonce', nonce);

    return response;
}

export const config = {
    matcher: [
        {
            // Apply to /cyper and all sub-paths, skip static assets and API routes
            source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' },
            ],
        },
    ],
};
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.cybersource.com; style-src 'self' 'unsafe-inline' https://*.cybersource.com; img-src 'self' data: https:; font-src 'self' data:; frame-src 'self' https://*.cybersource.com; connect-src 'self' https://*.cybersource.com"
                    }
                ]
            }
        ];
    },
};

module.exports = nextConfig;
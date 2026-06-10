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
                source: '/cyper',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' https://api.cybersource.com https://flex.cybersource.com https://h.online-metrix.net https://centinelapi.cardinalcommerce.com 'unsafe-inline'; style-src 'self' 'unsafe-inline'; frame-src 'self' https://flex.cybersource.com https://h.online-metrix.net https://centinelapi.cardinalcommerce.com; connect-src 'self' https://api.cybersource.com https://flex.cybersource.com https://h.online-metrix.net https://centinelapi.cardinalcommerce.com; img-src 'self' data: https://h.online-metrix.net"
                    }
                ]
            }
        ];
    },
};

module.exports = nextConfig;
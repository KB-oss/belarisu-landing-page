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
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://setup.cybersource.com https://testflex.cybersource.com https://*.cybersource.com https://*.online-metrix.net https://*.cardinalcommerce.com https://*.googleapis.com https://*.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.cybersource.com; font-src 'self' data: https://fonts.gstatic.com https://*.cybersource.com; frame-src 'self' https://*.cybersource.com https://*.online-metrix.net https://*.cardinalcommerce.com; connect-src 'self' https://*.cybersource.com https://*.online-metrix.net https://*.cardinalcommerce.com; img-src 'self' data: https://*.cybersource.com https://*.online-metrix.net"
                    }
                ]
            }
        ];
    },
};
module.exports = nextConfig;
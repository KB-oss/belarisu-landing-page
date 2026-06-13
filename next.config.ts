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
                        value: "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' https://*.cybersource.com https://*.googleapis.com https://*.gstatic.com; style-src * 'unsafe-inline' https://fonts.googleapis.com; img-src * data: blob: https://*.cybersource.com; font-src * data: https://fonts.gstatic.com; frame-src * https://*.cybersource.com; connect-src * https://*.cybersource.com"
                    }
                ]
            }
        ];
    },
};

module.exports = nextConfig;
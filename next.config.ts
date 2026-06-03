import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
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
                    value: "default-src * 'unsafe-inline' 'unsafe-eval' 'unsafe-hashes' 'wasm-unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' 'unsafe-hashes' 'wasm-unsafe-eval'; style-src * 'unsafe-inline' 'unsafe-hashes'; img-src * data: blob:; font-src * data:; frame-src *; connect-src *; media-src *; object-src *; worker-src *; frame-ancestors *; base-uri *; form-action *"
                }
            ]
        }
    ];
},
};
export default nextConfig;

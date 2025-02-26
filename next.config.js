/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true, // Use SWC minifier instead of Terser
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' http://localhost https://sandbox-buy.paddle.com",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

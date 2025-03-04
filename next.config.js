/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
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

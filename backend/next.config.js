/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  experimental: { serverActions: true },
  allowedDevOrigins: ['http://192.168.100.88:3001'],
};
module.exports = nextConfig;
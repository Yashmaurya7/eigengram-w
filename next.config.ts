import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.squarespace-cdn.com',
        port: '',
        pathname: '*',
        search: '',
      },
    ],
    domains: ['sdjfhsodfsjdfs'],
  },
};

export default nextConfig;

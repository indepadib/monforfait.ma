import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    // Disable static generation for dynamic routes
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;

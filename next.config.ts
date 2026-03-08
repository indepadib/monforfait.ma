import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify-compatible configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      }
    ],
  },
};

export default nextConfig;

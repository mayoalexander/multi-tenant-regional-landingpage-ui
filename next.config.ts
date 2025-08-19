import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Configure for Docker
  async rewrites() {
    return []
  },
  async headers() {
    return []
  }
};

export default nextConfig;

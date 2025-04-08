import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,  // Ensure React Strict Mode is enabled
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hh9smxsrhfrfr9px.public.blob.vercel-storage.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',  // Set the body size limit for server actions
    },
  },
};

export default nextConfig;

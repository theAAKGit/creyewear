import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', 
    },
  },
  images: {
    domains: [
      'hh9smxsrhfrfr9px.public.blob.vercel-storage.com', // ✅ Exact blob host only
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.blob.vercel-storage.com',
      },
    ],
    minimumCacheTTL: 60, // ✅ Cache for at least 60 seconds (adjust as needed)
    formats: ['image/avif', 'image/webp'], // ✅ Modern image formats for better performance
    deviceSizes: [320, 420, 768, 1024, 1200], // ✅ Mobile to desktop sizes
    imageSizes: [16, 32, 48, 64, 96], // ✅ Icon sizes and small images
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache na Vercel – szybsze ładowanie
  experimental: {
    staleTimes: {
      static: 86400, // 24h dla stron statycznych
      dynamic: 3600,  // 1h dla dynamicznych
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

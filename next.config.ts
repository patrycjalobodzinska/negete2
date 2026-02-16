import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache na Vercel – strony z Sanity revalidowane co godzinę
  experimental: {
    staleTimes: {
      static: 3600,
      dynamic: 60,
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

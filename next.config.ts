import type { NextConfig } from "next";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const _restart = 3;

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      static: 86400,
      dynamic: 3600,
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

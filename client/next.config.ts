import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
    domains: ["tushar-insights.up.railway.app"],
    unoptimized: true,
  }
};

export default nextConfig;
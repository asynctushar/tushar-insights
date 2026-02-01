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
    domains: ["remarkable-actor-aa9b49d4b5.strapiapp.com"],
    unoptimized: true,
  }
};

export default nextConfig;
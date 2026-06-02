import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Matches any domain on HTTPS
      },
      {
        protocol: "http",
        hostname: "**", // Matches any domain on HTTP (Optional, but useful for generic URLs)
      }
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: process.env.WORDPRESS_MEDIA_HOST
      ? [
          {
            protocol: "https",
            hostname: process.env.WORDPRESS_MEDIA_HOST,
          },
        ]
      : [],
  },
};

export default nextConfig;

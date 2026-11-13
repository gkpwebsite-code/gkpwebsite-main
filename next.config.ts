import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets phones on the same Wi-Fi open the dev server via the laptop's network address.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [90],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;

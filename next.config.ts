import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [90],
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;

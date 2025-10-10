import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["images.unsplash.com", "plus.unsplash.com", "images.pexels.com"], // 👈 add this line
  },
};

export default nextConfig;

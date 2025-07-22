import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['res.cloudinary.com','i.imgur.com'],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Add more hostnames here when integrating admin-uploaded images
      // e.g. your S3 bucket, Cloudinary, etc.
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // allowedDevOrigins: ['192.168.18.47'],
  serverExternalPackages: ["@ngrok/ngrok"],

  allowedDevOrigins: ["poet-thigh-capitol.ngrok-free.dev",'192.168.18.50'],
  // allowedDevOrigins: ['192.168.18.50'],
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  output: 'standalone',
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mark Prisma as external package to prevent build issues
  serverExternalPackages: ['@prisma/client'],
};

export default nextConfig;

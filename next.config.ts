import type { NextConfig } from 'next';

const cms = new URL(process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337');
const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: cms.protocol === 'https:' ? 'https' : 'http', hostname: cms.hostname, port: cms.port, pathname: '/uploads/**' },
      { protocol: 'https', hostname: '*.strapiapp.com' },
      { protocol: 'https', hostname: '*.cloudinary.com' },
      { protocol: 'https', hostname: '*.railway.app' },
    ],
    // Match the original Vercel image-quality configuration (Next default).
    qualities: [75],
    // Explicit opt-in for the isolated localhost tests; false for public hosting.
    dangerouslyAllowLocalIP: process.env.ALLOW_PRIVATE_CMS_IMAGES === 'true',
  },
};
export default nextConfig;

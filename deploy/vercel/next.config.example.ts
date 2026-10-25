// Review against the actual deployed branch. Do not replace the live config blindly.
// This example keeps the original provider patterns and adds the CMS hostname.
import type { NextConfig } from 'next';
const cms = new URL(process.env.NEXT_PUBLIC_STRAPI_URL || 'https://cms.YOUR-DOMAIN.si');
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: cms.hostname, port: cms.port, pathname: '/uploads/**' },
      { protocol: 'https', hostname: '*.strapiapp.com' },
      { protocol: 'https', hostname: '*.cloudinary.com' },
      { protocol: 'https', hostname: '*.railway.app' },
    ],
  },
};
export default nextConfig;

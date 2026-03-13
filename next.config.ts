import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // izklopi Turbopack
  turbopack: {
    // prazna konfiguracija = Turbopack je izklopljen
  },

  // omogoči Webpack
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;

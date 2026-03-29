import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // izklopi Turbopack
  turbopack: {
    // prazna konfiguracija = Turbopack je izklopljen
  },


   images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
  }, //za image uploade iz strapija ker niso vec local Image 

  // omogoči Webpack
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;

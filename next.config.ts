import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        // Encaminha chamadas de markers para a API remota
        source: "/api/markers/:path*",
        destination: `${process.env.API_URL}/api/markers/:path*`,
      },
    ];
  },
};

export default nextConfig;

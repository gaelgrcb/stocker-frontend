import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // 1. Redireccionamos físicamente de /login a /
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // 2. Enmascaramos / para que muestre el contenido de /login internamente
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/login',
      },
    ];
  },
};

export default nextConfig;
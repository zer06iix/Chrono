/** @type {import('next').NextConfig} */
const backendPort = process.env.BACKEND_PORT || 3001;

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://localhost:${backendPort}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

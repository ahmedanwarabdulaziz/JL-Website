/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.dev", pathname: "/**" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/residential/:path*",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/template-2/:path*",
        destination: "/commercial",
        permanent: true,
      },
      {
        source: "/hello-world/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/fabric-care-guide-alta/:path*",
        destination: "/fabric-care-guide",
        permanent: true,
      },
      {
        source: "/fabric-care-guide-crypton/:path*",
        destination: "/fabric-care-guide",
        permanent: true,
      },
      {
        source: "/fabric-care-guide-endurepel/:path*",
        destination: "/fabric-care-guide",
        permanent: true,
      },
      {
        source: "/fabric-care-guide-fibreguard/:path*",
        destination: "/fabric-care-guide",
        permanent: true,
      },
      {
        source: "/gallery/:path*",
        destination: "/projects",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

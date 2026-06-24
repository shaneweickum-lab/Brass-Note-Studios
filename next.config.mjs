

const nextConfig = {
  async redirects() {
    return [
      { source: "/method", destination: "/", permanent: false },
      { source: "/method/:path*", destination: "/", permanent: false },
      { source: "/academy", destination: "/", permanent: false },
      { source: "/academy/:path*", destination: "/", permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.suno.ai" },
      { protocol: "https", hostname: "suno.ai" },
    ],
  },
};

export default nextConfig;

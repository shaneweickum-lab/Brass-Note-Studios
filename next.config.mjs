

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.suno.ai" },
      { protocol: "https", hostname: "suno.ai" },
    ],
  },
};

export default nextConfig;

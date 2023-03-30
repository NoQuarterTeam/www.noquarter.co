/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 60, // 7 days
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "s3.eu-central-1.amazonaws.com", pathname: "*/www.noquarter.co/images/**" },
    ],
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig

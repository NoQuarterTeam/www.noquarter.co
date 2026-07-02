import type { NextConfig } from "next"

export default {
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    qualities: [30, 70, 75],
    remotePatterns: [
      // notion external unsplash images
      { protocol: "https", hostname: "images.unsplash.com" },
      // noquarter.co cloudfront
      { protocol: "https", hostname: "d23esfr6ddgb3k.cloudfront.net" },
      // dev only notion files
      { protocol: "https", hostname: "s3.us-west-2.amazonaws.com", pathname: "*/secure.notion-static.com/**" },
      { protocol: "https", hostname: "prod-files-secure.s3.us-west-2.amazonaws.com" },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  cacheComponents: true,
} satisfies NextConfig

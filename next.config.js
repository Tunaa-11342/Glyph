/** @type {import('next').NextConfig} */
const r2PublicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL
let r2Hostname
try {
  r2Hostname = r2PublicUrl ? new URL(r2PublicUrl).hostname : undefined
} catch {
  r2Hostname = undefined
}

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.clerk.com' },
      { protocol: 'https', hostname: 'images.clerk.dev' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'pub-*.r2.dev' },
      ...(r2Hostname ? [{ protocol: 'https', hostname: r2Hostname }] : []),
    ],
  },
}

module.exports = nextConfig

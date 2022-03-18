/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
}

module.exports = {
  env: {
    NEXT_PUBLIC_MORALIS_APP_ID: process.env.NEXT_PUBLIC_MORALIS_APP_ID,
    NEXT_PUBLIC_MORALIS_SERVER_URL: process.env.NEXT_PUBLIC_MORALIS_SERVER_URL,
    WEB3AUTH_CLIENT_ID: process.env.WEB3AUTH_CLIENT_ID
  },
  images: {
    domains: ['localhost'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

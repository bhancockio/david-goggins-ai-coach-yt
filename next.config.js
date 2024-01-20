/** @type {import('next').NextConfig} */
const withPwa = require("next-pwa")({
  dest: "public",
  swSrc: "/public/custom-service-worker.js",
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest.json$/, /app-build-manifest.json$/],
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = withPwa({
  reactStrictMode: true,
});

module.exports = nextConfig;

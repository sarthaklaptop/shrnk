/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "avatar.iran.liara.run",
      "lh3.googleusercontent.com",
      "api.qrserver.com",
    ],
    remotePatterns: [
      { hostname: "avatar.iran.liara.run" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "api.qrserver.com" },
    ],
  },
};

export default nextConfig;
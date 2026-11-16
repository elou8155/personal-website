import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server run its scripts when the site is opened at
  // http://127.0.0.1:3000 instead of http://localhost:3000.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;

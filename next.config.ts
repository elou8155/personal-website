import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server run its scripts when the site is opened by any address
  // other than http://localhost:3000: 127.0.0.1, your computer's address on the
  // local network (so you can open the site from your phone), or its .local name.
  allowedDevOrigins: ["127.0.0.1", "192.168.*.*", "10.*.*.*", "172.*.*.*", "*.local"],
};

export default nextConfig;

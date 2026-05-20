import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" }],
      },
    ];
  },
};

export default nextConfig;

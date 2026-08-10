import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["better-sqlite3"],
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/better-sqlite3/**/*",
      "./node_modules/bindings/**/*",
      "./node_modules/file-uri-to-path/**/*",
      "./node_modules/node-addon-api/**/*",
    ],
  },
};

export default nextConfig;

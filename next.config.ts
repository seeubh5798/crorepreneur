import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build the site as plain files in out/, for any static host (it runs on
  // Cloudflare Workers; see wrangler.jsonc). Every page is prerendered, so
  // nothing needs a server. Cache Components and partial prefetching need
  // one, so they stay off.
  output: "export",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

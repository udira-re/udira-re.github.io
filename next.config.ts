import type { NextConfig } from "next";

// Static export for GitHub Pages: every route becomes plain HTML in `out/`.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;

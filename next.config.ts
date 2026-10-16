import type { NextConfig } from "next";

const pages = process.env.GITHUB_PAGES === "true";
const basePath = pages ? process.env.NEXT_PUBLIC_BASE_PATH ?? "/bwpone" : "";

const config: NextConfig = {
  output: pages ? "export" : "standalone",
  basePath,
  trailingSlash: pages,
  poweredByHeader: false,
  ...(!pages && { async redirects() {
    return [{ source: "/", destination: "/zh", permanent: false }];
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Robots-Tag", value: "noindex, nofollow" }
      ]
    }];
  } })
};

export default config;

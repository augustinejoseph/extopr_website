import { withPayload } from "@payloadcms/next/withPayload";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server Components by default; only opt into client where needed.
  reactStrictMode: true,
  images: {
    // YouTube thumbnail CDN for the video lite facade; R2/remote media added when hosting moves.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  // CMS-managed 301/302 redirects are applied in middleware (see src/middleware.ts), not here:
  // next.config compiles to a standalone file that cannot resolve the Payload config, so a
  // request-time lookup against the Payload REST API (cached) is used instead.
};

// withPayload mounts the Payload admin + API into the same Next.js app.
export default withPayload(nextConfig);

import path from "node:path";
import type { NextConfig } from "next";

const config: NextConfig = {
  // `standalone` makes the Docker/VPS image small; Vercel ignores it.
  output: "standalone",
  outputFileTracingRoot: path.join(process.cwd(), "../.."),
  transpilePackages: [
    "@template/ui",
    "@template/auth", // @module:auth
    "@template/validators",
    "@template/api",
    "@template/db",
    "@template/payments", // @module:payments
    "@template/jobs", // @module:jobs
    "@template/observability", // @module:observability
  ],
};

export default config;

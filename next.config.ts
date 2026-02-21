import type { NextConfig } from "next";
import { execSync } from "child_process";

let commitHash = "unknown";
let commitDate = "unknown";

try {
  commitHash = execSync('git log -1 --format="%h"').toString().trim();
  commitDate = execSync('git log -1 --format="%cd" --date=format:"%B %d, %Y"').toString().trim();
} catch (e) {
  // Ignore
}

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    COMMIT_HASH: process.env.VERCEL_GIT_COMMIT_SHA ? process.env.VERCEL_GIT_COMMIT_SHA.substring(0, 7) : commitHash,
    COMMIT_DATE: commitDate,
  },
  images: {
    domains: ['hc-cdn.hel1.your-objectstorage.com'],
  }
};

export default nextConfig;

import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Call `next build` directly so `npm run build` can be OpenNext
// without recursively invoking this same script.
export default {
  ...defineCloudflareConfig({}),
  buildCommand: "npx next build",
};

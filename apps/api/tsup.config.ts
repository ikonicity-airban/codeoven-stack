import { defineConfig } from "tsup";

// Bundle everything (incl. workspace TS packages) into one file so the Docker runtime needs no node_modules.
export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  platform: "node",
  target: "node22",
  clean: true,
  noExternal: [/.*/],
  banner: {
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
  },
});

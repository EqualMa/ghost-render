import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { dependencies } from "./package.json";

const deps = new Set(Object.keys(dependencies));

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    target: "esnext",
    sourcemap: true,
    lib: {
      entry: { index: resolve(__dirname, "src/index.ts") },
      formats: ["es"],
    },
    rollupOptions: {
      external: (source, importer, isResolved) => {
        if (
          source.includes(
            "/ghost/core/server/services/email-service/EmailRenderer.js"
          )
        )
          return false;

        if (deps.has(source)) return true;

        if (source.includes("/node_modules/"))
          throw new Error(`unexpected source file from node_modules will be bundled.
source: ${source}
importer: ${importer}
isResolved: ${isResolved}`);

        return false;
      },
    },
  },
});

import { defineConfig } from "vite";
import { dependencies } from "./package.json";
import * as _dts from "unplugin-dts/vite";

const dts = (_dts as unknown as { default: typeof import("unplugin-dts/vite") })
  .default;

const deps = new Set(Object.keys(dependencies));

export default defineConfig({
  plugins: [dts()],
  build: {
    target: "esnext",
    sourcemap: true,
    lib: {
      entry: "index.ts",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: (source, importer, isResolved) => {
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

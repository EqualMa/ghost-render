import { defineConfig } from "vite";
import { dependencies } from "./package.json";
import { tsImport } from "tsx/esm/api";
import * as _dts from "unplugin-dts/vite";

const dts = (_dts as unknown as { default: typeof import("unplugin-dts/vite") })
  .default;

const { default: pkg } = (await tsImport(
  "@ghost-render/rollup-plugin-pkg-json",
  import.meta.url
)) as typeof import("@ghost-render/rollup-plugin-pkg-json");

const deps = new Set(Object.keys(dependencies));

export default defineConfig({
  plugins: [
    //
    dts(),
    pkg(),
  ],
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
        if (
          source === "ghost" ||
          source.startsWith("ghost/") ||
          source.includes("/node_modules/ghost/")
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
    commonjsOptions: {
      esmExternals: ["luxon"],
      strictRequires: "auto",
      requireReturnsDefault: (id) => (id === "luxon" ? "namespace" : false),
    },
  },
});

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { dependencies } from "./package.json";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { tsImport } from "tsx/esm/api";
import * as _dts from "unplugin-dts/vite";

const dts = (_dts as unknown as { default: typeof import("unplugin-dts/vite") })
  .default;

const { default: pkg } = (await tsImport(
  "@ghost-render/rollup-plugin-pkg-json",
  import.meta.url
)) as typeof import("@ghost-render/rollup-plugin-pkg-json");

const deps = new Set(Object.keys(dependencies));

const __dirname = dirname(fileURLToPath(import.meta.url));

const MOD_EmailRenderer =
  "ghost/core/server/services/email-service/EmailRenderer.js";
const sourcePathOfEmailRenderer = fileURLToPath(
  import.meta.resolve(MOD_EmailRenderer)
);

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: [
            sourcePathOfEmailRenderer,
            resolve(
              dirname(sourcePathOfEmailRenderer),
              "EmailRendererTypes.d.ts"
            ),
          ],
          dest: resolve(__dirname, "tmp"),
        },
      ],
      hook: "buildStart",
    }),
    dts({
      bundleTypes: true,
      copyDtsFiles: true,
    }),
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
  resolve: {
    alias: {
      [MOD_EmailRenderer]: resolve(__dirname, "tmp/EmailRenderer.js"),
    },
  },
});

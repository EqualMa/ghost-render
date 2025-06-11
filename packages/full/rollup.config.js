// @ts-check

import { dts } from "rollup-plugin-dts";
import { defineConfig } from "rollup";
import { tsImport } from "tsx/esm/api";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {typeof import("./vite-config/common.ts")} */
const { MODULES, modulesToEntries } = await tsImport(
  "./vite-config/common.ts",
  import.meta.url
);

export default defineConfig({
  input: modulesToEntries(MODULES, "", resolve(__dirname, "src"), ".ts"),
  output: {
    dir: "dist",
    chunkFileNames: "_chunks/[name]-[hash].d.ts",
    sourcemap: true,
  },
  plugins: [dts({ respectExternal: true })],
  external: (source) => {
    if (source === "ghost" || source.startsWith("ghost/")) return false;

    if (/^[a-zA-Z@]/.test(source)) return true;

    return false;
  },
});

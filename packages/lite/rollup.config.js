// @ts-check

import { defineConfig } from "rollup";
import { tsImport } from "tsx/esm/api";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import * as fsp from "node:fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));

const { dependencies, devDependencies } = JSON.parse(
  await fsp.readFile(resolve(__dirname, "./package.json"), "utf-8")
);

/** @type {typeof import("./vite-config/modules.ts")} */
const { LITE_MODULES, modulesToEntries } = await tsImport(
  "./vite-config/modules.ts",
  import.meta.url
);
/** @type {typeof import("@ghost-render/full/vite-config/dts-rollup.ts")} */
const { default: dtsRollupOptions } = await tsImport(
  "@ghost-render/full/vite-config/dts-rollup.ts",
  import.meta.url
);

/** @type {typeof import("./vite-config/external.ts")} */
const { default: makeExternal } = await tsImport(
  "./vite-config/external.ts",
  import.meta.url
);

const { external } = makeExternal({
  deps: Object.keys(dependencies),
  bundledDeps: Object.keys(devDependencies),
});

export default defineConfig({
  ...dtsRollupOptions(),
  input: modulesToEntries(LITE_MODULES, "", resolve(__dirname, "src"), ".ts"),
  external,
});

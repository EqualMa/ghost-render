import { dirname, resolve, relative, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import handlebars from "./vite-config/handlebars";
import { analyzer } from "vite-bundle-analyzer";
import { tsImport } from "tsx/esm/api";

const { default: pkg } = (await tsImport(
  "@ghost-render/full/vite-config/plugin-pkg",
  import.meta.url
)) as typeof import("@ghost-render/full/vite-config/plugin-pkg");
import { dependencies, devDependencies } from "./package.json";
import { LITE_MODULES, modulesToEntries } from "./vite-config/modules";
import makeExternal from "./vite-config/external";

const { deps, bundledDeps, external } = makeExternal({
  deps: Object.keys(dependencies),
  bundledDeps: Object.keys(devDependencies),
});
// This package will be copied
bundledDeps.markAsUsed("@tryghost/i18n");

const __dirname = dirname(fileURLToPath(import.meta.url));

const localesDir = resolve(
  dirname(fileURLToPath(import.meta.resolve("@tryghost/i18n/package.json"))),
  "locales/"
);

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: join(localesDir, "*/ghost.json"),
          dest: "locales",
          rename: (_name, _ext, fullPath) => {
            return relative(localesDir, fullPath);
          },
        },
      ],
      hook: "buildStart",
    }),
    handlebars,
    process.env.ANALYZE === "true" && analyzer(),
    {
      name: "no-unused-dependencies",
      buildEnd(error) {
        if (error) return;
        {
          const unusedDeps = deps.unusedDeps();
          if (unusedDeps.length)
            this.warn(`Unused dependencies: ${unusedDeps.join(", ")}`);
        }
        {
          const unusedBundledDeps = bundledDeps.unusedDeps();

          if (unusedBundledDeps.length)
            this.warn(
              `Unused bundled dependencies: ${unusedBundledDeps.join(", ")}`
            );
        }
      },
    },
    pkg(),
  ],
  build: {
    outDir: "dist",
    target: "esnext",
    sourcemap: true,
    lib: {
      entry: modulesToEntries(LITE_MODULES, "", resolve(__dirname, "src")),
      formats: ["es"],
    },
    rollupOptions: {
      output: { chunkFileNames: "_chunks/[name]-[hash].js" },
      external,
    },
  },
  resolve: {
    alias: [
      {
        find: "simple-dom",
        replacement: "simple-dom/dist/commonjs/es5",
      },
      {
        find: "@tryghost/color-utils",
        replacement: "@tryghost/color-utils/src/color-utils.ts",
      },
    ],
  },
});

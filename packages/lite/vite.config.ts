import { dirname, resolve, relative, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import handlebars from "./vite-config/handlebars";
import DependenciesUsed from "./vite-config/deps";
import { analyzer } from "vite-bundle-analyzer";
import { tsImport } from "tsx/esm/api";
import type { OverridableModuleDescriptions } from "@ghost-render/full/vite-config/common";
const { MODULES, modulesToEntries } = (await tsImport(
  "@ghost-render/full/vite-config/common",
  import.meta.url
)) as typeof import("@ghost-render/full/vite-config/common");

import { dependencies, devDependencies } from "./package.json";

const deps = new DependenciesUsed(Object.keys(dependencies));
const bundledDeps = new DependenciesUsed(Object.keys(devDependencies));

// This package will be copied
bundledDeps.markAsUsed("@tryghost/i18n");

const LITE_MODULES = {
  ...MODULES,
  dependencies: {
    ...MODULES.dependencies,
    makeT: undefined,
    settingsCache: undefined,
    labs: undefined,
    settingsHelpers: undefined,
    urlUtils: undefined,
    renderers: undefined,
  } satisfies OverridableModuleDescriptions["dependencies"],
  lib: {
    renderers: {
      "": true,
      lexical: true,
      mobiledoc: true,
    },
    Labs: true,
    makeTFromResources: true,
    SettingsCache: true,
    UrlUtils: true,
  },
} as const;

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
  ],
  build: {
    outDir: "dist",
    emptyOutDir: false,
    target: "esnext",
    sourcemap: true,
    lib: {
      entry: modulesToEntries(LITE_MODULES, "", resolve(__dirname, "src")),
      formats: ["es"],
    },
    rollupOptions: {
      output: { chunkFileNames: "_chunks/[name]-[hash].js" },
      external: (() => {
        const importedExternals = {
          jsdom: [
            "path",
            "fs",
            "vm",
            "events",
            "url",
            "fs",
            "util",
            "http",
            "https",
            "stream",
            "zlib",
            "crypto",
            "child_process",
            "os",
          ],
          "image-size": ["fs", "path"],
          "tough-cookie": ["util"],
          queue: ["events"],
          "http-proxy-agent": ["net", "tls", "events", "url"],
          "https-proxy-agent": ["net", "tls", "assert", "url"],
          "agent-base": ["net", "http", "https"],
          "@tryghost/url-utils": ["url"],
        };
        const isImportedExternals = (() => {
          const importers = Object.entries(importedExternals).map(
            ([k, externals]) => ({
              importer: `/node_modules/${k}/`,
              externals: new Set(externals),
            })
          );

          const allExternals = importers.reduce(
            (prev, cur) => prev.union(cur.externals),
            new Set<string>()
          );

          return (source: string, importer: string) => {
            if (
              importer === `\x00${source}?commonjs-external` &&
              allExternals.has(source)
            ) {
              return true;
            }

            return importers.some(
              (v) => importer.includes(v.importer) && v.externals.has(source)
            );
          };
        })();

        return (source, importer) => {
          if (source.startsWith("node:")) return true;

          if (deps.testAndMarkAsUsed(source)) return true;
          if (bundledDeps.testAndMarkAsUsed(source)) return false;

          if (
            importer?.includes("/node_modules/ghost/") &&
            source === "nodemailer/lib/addressparser"
          )
            return false;

          if (/^[a-zA-Z@]/.test(source)) {
            throw new Error(
              `implicit dependency ${source} imported by ${importer}`
            );
          }

          return false;
        };
      })(),
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

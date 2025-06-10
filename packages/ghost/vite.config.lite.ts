import { dirname, resolve, relative, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import {
  MODULES,
  modulesToEntries,
  type OverridableModuleDescriptions,
} from "./vite-config/common";
import { viteStaticCopy } from "vite-plugin-static-copy";
import handlebars from "./vite-config/handlebars";

import { analyzer } from "vite-bundle-analyzer";

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
  dirname(require.resolve("@tryghost/i18n/package.json")),
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
  ],
  build: {
    outDir: "dist",
    emptyOutDir: false,
    target: "esnext",
    sourcemap: true,
    lib: {
      entry: {
        ...modulesToEntries(LITE_MODULES, "lite", resolve(__dirname, "src")),
        EmailRenderer: resolve(__dirname, "src/EmailRenderer"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      output: { chunkFileNames: "lite/[name]-[hash].js" },
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
          if (importer && isImportedExternals(source, importer)) {
            return true;
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

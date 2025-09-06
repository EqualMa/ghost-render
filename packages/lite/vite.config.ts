import { dirname, resolve, relative, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import handlebars from "./vite-config/handlebars";
import { analyzer } from "vite-bundle-analyzer";
import { tsImport } from "tsx/esm/api";

const { default: pkg } = (await tsImport(
  "@ghost-render/rollup-plugin-pkg-json",
  import.meta.url
)) as typeof import("@ghost-render/rollup-plugin-pkg-json");
import { dependencies, devDependencies } from "./package.json";
import { LITE_MODULES, modulesToEntries } from "./vite-config/modules";
import makeExternal from "./vite-config/external";

const { deps, bundledDeps, external } = makeExternal({
  deps: [...Object.keys(dependencies)],
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
    (() => {
      let found = false;

      const SOURCE = fileURLToPath(
        import.meta.resolve(
          "@ghost-render/full/src/_getDefaultExampleMember.ts"
        )
      );

      const V_MOD = "\0virtual:_getDefaultExampleMember";

      const MOD_ID_EmailService =
        "ghost/core/server/services/email-service/EmailService.js";

      return {
        name: "EmailService_prototype_getDefaultExampleMember",
        resolveId: {
          async handler(source, importer, options) {
            if (source.includes("_getDefaultExampleMember")) {
              const resolved = await this.resolve(source, importer, options);

              if (resolved?.id === SOURCE) {
                return V_MOD;
              }
            }
          },
          order: "pre",
        },
        async load(id) {
          if (id !== V_MOD) return;
          found = true;
          const { default: EmailService } = await import(MOD_ID_EmailService);
          const source =
            EmailService.prototype.getDefaultExampleMember.toString();

          return `export default function ${source}`;
        },
        buildEnd() {
          if (!found) this.error(`${SOURCE} should be loaded`);
        },
      };
    })(),
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

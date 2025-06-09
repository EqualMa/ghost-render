import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { MODULES, modulesToEntries } from "./vite-config/common";
import { dependencies, peerDependencies } from "./package.json";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    outDir: "dist/full",
    target: "esnext",
    sourcemap: true,
    lib: {
      entry: modulesToEntries(MODULES, "", resolve(__dirname, "src/full")),
      formats: ["es"],
    },
    rollupOptions: {
      external: (() => {
        const depNames = new Set(
          [dependencies, peerDependencies].flatMap((deps) => Object.keys(deps))
        );
        const depNameSlash = depNames
          .values()
          .map((n) => `${n}/`)
          .toArray();

        return (source) => {
          if (source.startsWith("node:")) return true;
          if (depNames.has(source)) return true;

          if (depNameSlash.some((dep) => source.startsWith(dep))) return true;

          if (/^[a-zA-Z@]/.test(source))
            throw new Error(`import "${source}" is not externalized`);

          return false;
        };
      })(),
    },
  },
  resolve: {
    alias: [
      {
        find: /EmailRenderer/,
        replacement: "EmailRenderer",
        customResolver: (source, importer) => {
          if (!importer) return undefined;
          if (
            resolve(dirname(importer), source) ===
            resolve(__dirname, "src/EmailRenderer")
          ) {
            return { id: source + ".mjs", external: true };
          }
          return undefined;
        },
      },
    ],
  },
});

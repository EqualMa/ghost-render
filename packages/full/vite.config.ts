import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { MODULES, modulesToEntries } from "./vite-config/common";
import { dependencies, peerDependencies } from "./package.json";
import { tsImport } from "tsx/esm/api";

const { default: pkg } = (await tsImport(
  "@ghost-render/rollup-plugin-pkg-json",
  import.meta.url
)) as typeof import("@ghost-render/rollup-plugin-pkg-json");

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [pkg()],
  build: {
    outDir: "dist",
    target: "esnext",
    sourcemap: true,
    lib: {
      entry: modulesToEntries(MODULES, "", resolve(__dirname, "src")),
      formats: ["es"],
    },
    rollupOptions: {
      output: { chunkFileNames: "_chunks/[name]-[hash].js" },
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
});

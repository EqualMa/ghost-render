import { dts } from "rollup-plugin-dts";
import type { Plugin, OutputOptions } from "rollup";

export interface DtsRollupOptions {
  output: OutputOptions;
  plugins: Plugin[];
}

export default function dtsRollupOptions(): DtsRollupOptions {
  return {
    output: {
      dir: "dist",
      chunkFileNames: "_chunks/[name]-[hash].d.ts",
      sourcemap: true,
    },
    plugins: [dts({ respectExternal: true })],
  };
}

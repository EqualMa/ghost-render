import type { Plugin } from "vite";
import handlebarsImport from "handlebars";
const { precompile } = handlebarsImport;

const handlebars: Plugin = {
  name: "handlebars",
  transform: {
    filter: { id: /\.hbs$/ },
    handler(code, id) {
      if (!id.endsWith(".hbs")) {
        return null;
      }

      const { code: spec, map } = precompile(code, {
        srcName: id,
        strict: true,
        preventIndent: true,
      }) as { code: string; map: string };

      if (typeof spec !== "string") {
        throw new Error("unexpected template spec", spec);
      }

      // TODO: the sourcemap is wrong because we add some code
      return {
        code: `export default ${spec};`,
        map,
      };
    },
  },
};

export default handlebars;

import type { Plugin } from "vite";
import handlebarsImport from "handlebars";
const { precompile } = handlebarsImport;

const handlebars: Plugin = {
  name: "handlebars",
  transform(code, id) {
    if (!id.endsWith(".hbs")) {
      return null;
    }

    const spec = precompile(code, {
      strict: true,
      preventIndent: true,
    });

    if (typeof spec !== "string") {
      throw new Error("unexpected template spec", spec);
    }

    return `export default ${spec};`;
  },
};

export default handlebars;

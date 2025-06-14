import HandlebarsRuntime from "handlebars/runtime.js";

const create: typeof import("handlebars/runtime")["create"] = (
  HandlebarsRuntime as typeof import("handlebars/runtime")
).create;
export default create;

import EmailRenderer from "../EmailRenderer";
import * as dependencies from "./dependencies";

export default function makeEmailRendererFull(): EmailRenderer {
  return new EmailRenderer(dependencies);
}

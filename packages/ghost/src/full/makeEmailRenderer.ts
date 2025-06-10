import EmailRenderer from "@ghost-render/email-renderer";
import * as dependencies from "./dependencies";

export default function makeEmailRendererFull(): EmailRenderer {
  return new EmailRenderer(dependencies);
}

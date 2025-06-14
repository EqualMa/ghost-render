import { registerHelpers } from "ghost/core/server/services/email-service/helpers/register-helpers";
import handlebarsRuntimeCreate from "@ghost-render/full/src/reexports/handlebars/runtime/create";

import cssPartialSource from "ghost/core/server/services/email-service/email-templates/partials/styles.hbs";
import paywallPartial from "ghost/core/server/services/email-service/email-templates/partials/paywall.hbs";
import feedbackButtonPartial from "ghost/core/server/services/email-service/email-templates/partials/feedback-button.hbs";
import latestPostsPartial from "ghost/core/server/services/email-service/email-templates/partials/latest-posts.hbs";
import htmlTemplateSource from "ghost/core/server/services/email-service/email-templates/template.hbs";
import type {
  ImportsMakeRenderTemplateDeps,
  ImportsRenderTemplate,
} from "@ghost-render/email-renderer";

export default function makeRenderTemplate({
  labs,
  t,
}: ImportsMakeRenderTemplateDeps): ImportsRenderTemplate {
  const handlebarsRuntime = handlebarsRuntimeCreate();

  // Register helpers
  registerHelpers(handlebarsRuntime, labs, t);

  // Partials
  handlebarsRuntime.registerPartial("styles", cssPartialSource);
  handlebarsRuntime.registerPartial("paywall", paywallPartial);
  handlebarsRuntime.registerPartial("feedbackButton", feedbackButtonPartial);
  handlebarsRuntime.registerPartial("latestPosts", latestPostsPartial);

  // Actual template
  return handlebarsRuntime.template(htmlTemplateSource);
}

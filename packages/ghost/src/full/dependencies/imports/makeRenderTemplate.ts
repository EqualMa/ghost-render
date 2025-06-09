import { registerHelpers } from "ghost/core/server/services/email-service/helpers/register-helpers";
import type { Imports } from "ghost/core/server/services/email-service/EmailRenderer";
import { create as handlebarsCreate } from "handlebars";
import * as fsp from "node:fs/promises";
import { fileURLToPath } from "node:url";

export default (function makeRenderTemplate({ labs, t }) {
  const handlebars = handlebarsCreate();

  // Register helpers
  registerHelpers(handlebars, labs, t);

  const renderTemplatePromise = renderTemplate(handlebars);

  return async (templateData) => {
    const renderTemplate = await renderTemplatePromise;
    return renderTemplate(templateData);
  };
} satisfies Imports["makeRenderTemplate"] as Imports["makeRenderTemplate"]);

async function renderTemplate(handlebars: typeof import("handlebars")) {
  const [
    // Partials
    cssPartialSource,
    paywallPartial,
    feedbackButtonPartial,
    latestPostsPartial,
    // Actual template
    htmlTemplateSource,
  ] = await Promise.all(
    [
      import.meta.resolve(
        "ghost/core/server/services/email-service/email-templates/partials/styles.hbs"
      ),
      import.meta.resolve(
        "ghost/core/server/services/email-service/email-templates/partials/paywall.hbs"
      ),
      import.meta.resolve(
        "ghost/core/server/services/email-service/email-templates/partials/feedback-button.hbs"
      ),
      import.meta.resolve(
        "ghost/core/server/services/email-service/email-templates/partials/latest-posts.hbs"
      ),
      import.meta.resolve(
        "ghost/core/server/services/email-service/email-templates/template.hbs"
      ),
    ].map(readUrl)
  );

  handlebars.registerPartial("styles", cssPartialSource);
  handlebars.registerPartial("paywall", paywallPartial);
  handlebars.registerPartial("feedbackButton", feedbackButtonPartial);
  handlebars.registerPartial("latestPosts", latestPostsPartial);

  const renderTemplate = handlebars.compile(htmlTemplateSource);

  return renderTemplate;
}

async function readUrl(url: string): Promise<string> {
  const pathname = fileURLToPath(url);
  const data = fsp.readFile(pathname, "utf-8");
  return data;
}

import {
  LexicalHtmlRenderer,
  DEFAULT_NODES as nodes,
} from "ghost/reexports-for-lite/lexical.mjs";

import type { Dependencies } from "@ghost-render/email-renderer";

export interface RendererLexicalLabs {
  isSet(
    key: "contentVisibility" | "emailCustomization" | "emailCustomizationAlpha"
  ): boolean;
}

const lexicalHtmlRenderer = new LexicalHtmlRenderer({
  nodes: nodes as [],
});

export default function makeRendererLexical({
  getSiteUrl,
  labs,
}: {
  getSiteUrl: () => string;
  labs: RendererLexicalLabs;
}): Dependencies["renderers"]["lexical"] {
  const siteUrl = getSiteUrl();
  const imageOptimization = null;

  const rendererLexical: Dependencies["renderers"]["lexical"] = {
    async render(lexical, userOptions) {
      const options = Object.assign(
        {
          siteUrl,
          imageOptimization,
          canTransformImage() {
            return false;
          },
          feature: {
            contentVisibility: labs.isSet("contentVisibility"),
            emailCustomization: labs.isSet("emailCustomization"),
            emailCustomizationAlpha: labs.isSet("emailCustomizationAlpha"),
          },
          nodeRenderers: await getCustomNodeRenderers(labs),
        },
        userOptions
      );

      return await lexicalHtmlRenderer.render(lexical, options);
    },
  };
  return rendererLexical;
}

async function getCustomNodeRenderers(labs: {
  isSet(key: "emailCustomizationAlpha" | "emailCustomization"): boolean;
}) {
  if (
    !labs.isSet("emailCustomizationAlpha") &&
    !labs.isSet("emailCustomization")
  ) {
    return undefined;
  }

  try {
    const customNodeRenderers = (
      await import("@ghost-render/koenig-node-renderers")
    ).default;
    return customNodeRenderers;
  } catch (err) {
    throw new InternalServerError({
      message: "Unable to render post content",
      context: "The custom node renderers module could not be required",
      code: "KOENIG_CUSTOM_NODE_RENDERERS_LOAD_ERROR",
      err: err,
    });
  }
}

class InternalServerError extends Error {
  code: string;
  context: string;

  constructor({
    message,
    code,
    context,
    err,
  }: {
    message: string;
    context: string;
    code: string;
    err: unknown;
  }) {
    super(message, { cause: err });
    this.message = message;
    this.code = code;
    this.context = context;
  }
}

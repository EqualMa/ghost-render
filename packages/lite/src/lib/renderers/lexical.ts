/** A lite version of node_modules/ghost/core/server/lib/lexical.js */

import {
  LexicalHtmlRenderer,
  DEFAULT_NODES as nodes,
} from "ghost/reexports-for-lite/lexical.mjs";

import type { Dependencies } from "@ghost-render/email-renderer";

import customNodeRenderers from "@ghost-render/koenig-node-renderers";

export interface RendererLexicalLabs {
  isSet(key: "contentVisibility"): boolean;
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
            emailCustomization: true, // force on until Koenig has been bumped
          },
          nodeRenderers: customNodeRenderers,
        },
        userOptions
      );

      return await lexicalHtmlRenderer.render(lexical, options);
    },
  };
  return rendererLexical;
}

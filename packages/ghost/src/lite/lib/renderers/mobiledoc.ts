import {
  MobiledocHtmlRenderer,
  CardFactory,
  defaultCards,
} from "ghost/reexports-for-lite/mobiledoc.mjs";

import type { Dependencies } from "../../../EmailRenderer";

export default function makeRendererMobiledoc({
  getSiteUrl,
  loggingError,
}: {
  getSiteUrl: () => string;
  loggingError: (err: unknown) => void;
}) {
  const siteUrl = getSiteUrl();
  const imageOptimization = null;
  const cardFactory = new CardFactory({
    siteUrl,
    imageOptimization,
    canTransformImage() {
      return false;
    },
  });

  const cards = defaultCards.map((card: unknown) => {
    return cardFactory.createCard(card);
  });

  const atoms = require("@tryghost/kg-default-atoms");

  const mobiledocHtmlRenderer = new MobiledocHtmlRenderer({
    cards,
    atoms,
    unknownCardHandler(args: { env: { name: unknown } }) {
      loggingError(
        new Error("Mobiledoc card '" + args.env.name + "' not found.")
      );
    },
  });

  const rendererMobiledoc: Dependencies["renderers"]["mobiledoc"] = {
    render(mobiledoc, options) {
      return mobiledocHtmlRenderer.render(mobiledoc, options);
    },
  };

  return rendererMobiledoc;
}

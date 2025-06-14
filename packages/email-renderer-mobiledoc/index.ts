import MobiledocHtmlRenderer from "@tryghost/kg-mobiledoc-html-renderer";
import CardFactory from "@tryghost/kg-card-factory";
import defaultCards from "@tryghost/kg-default-cards";
import atoms from "@tryghost/kg-default-atoms";

export interface MobiledocMakeRendererOptions {
  getSiteUrl: () => string;
  loggingError: (err: unknown) => void;
}

export interface MobiledocRenderer {
  render(object: unknown, options?: object): string;
}

export default function mobiledocMakeRenderer({
  getSiteUrl,
  loggingError,
}: MobiledocMakeRendererOptions): MobiledocRenderer {
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

  const mobiledocHtmlRenderer = new MobiledocHtmlRenderer({
    cards,
    atoms,
    unknownCardHandler(args: { env: { name: unknown } }) {
      loggingError(
        new Error("Mobiledoc card '" + args.env.name + "' not found.")
      );
    },
  });

  const rendererMobiledoc: MobiledocRenderer = {
    render(mobiledoc, options) {
      return mobiledocHtmlRenderer.render(mobiledoc, options);
    },
  };

  // checks that MobiledocRenderer is assignable to Dependencies["renderers"]["mobiledoc"]
  return rendererMobiledoc satisfies import("@ghost-render/email-renderer").Dependencies["renderers"]["mobiledoc"];
}

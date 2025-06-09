import type { Dependencies } from "../../../EmailRenderer";
import makeRendererLexical, { type RendererLexicalLabs } from "./lexical";
import makeRendererMobiledoc from "./mobiledoc";

export default function makeRenderers({
  getSiteUrl,
  labs,
  loggingError,
}: {
  getSiteUrl: () => string;
  labs: RendererLexicalLabs;
  loggingError: (msg: unknown) => void;
}): Dependencies["renderers"] {
  return {
    lexical: makeRendererLexical({
      getSiteUrl,
      labs,
    }),
    mobiledoc: makeRendererMobiledoc({
      getSiteUrl,
      loggingError,
    }),
  };
}

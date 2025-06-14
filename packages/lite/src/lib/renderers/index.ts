import type { Dependencies } from "@ghost-render/email-renderer";
import makeRendererLexical, { type RendererLexicalLabs } from "./lexical";

export default function makeRenderers({
  getSiteUrl,
  labs,
  mobiledoc,
}: {
  getSiteUrl: () => string;
  labs: RendererLexicalLabs;
  mobiledoc: MakeRenderersMobiledoc | undefined;
}): Dependencies["renderers"] {
  return {
    lexical: makeRendererLexical({
      getSiteUrl,
      labs,
    }),
    mobiledoc: mobiledoc
      ? mobiledoc.makeRenderer({
          getSiteUrl,
          loggingError: mobiledoc.loggingError,
        })
      : unimplementedRendererMobiledoc(),
  };
}

export interface MakeRenderersMobiledoc {
  makeRenderer: MobiledocMakeRenderer;
  loggingError: (msg: unknown) => void;
}

export type MobiledocMakeRenderer = (context: {
  getSiteUrl: () => string;
  loggingError: (msg: unknown) => void;
}) => Dependencies["renderers"]["mobiledoc"];

function unimplementedRendererMobiledoc(): Dependencies["renderers"]["mobiledoc"] {
  return {
    render: () => {
      throw new Error("mobiledoc renderer not implemented");
    },
  };
}

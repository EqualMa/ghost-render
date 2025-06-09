import type { Dependencies } from "../src/EmailRenderer";

interface ModulesDependencies
  extends Record<
    Exclude<keyof Dependencies, "imports" | "models" | "renderers">,
    true
  > {
  imports: Record<keyof Dependencies["imports"], true> & {
    "": true;
  };
  models: Record<keyof Dependencies["models"], true> & {
    "": true;
  };
  renderers: Record<keyof Dependencies["renderers"], true> & {
    "": true;
  };
  "": true;
}

export type OverridableModuleDescriptions<
  MD extends ModuleDescriptions = typeof MODULES
> = {
  [K in keyof MD]:
    | undefined
    | true
    | OverridableModuleDescriptions<MD[K] & ModuleDescriptions>;
};

export const MODULES = {
  makeEmailRenderer: true,
  dependencies: {
    "": true,
    audienceFeedbackService: true,
    makeT: true,
    emailAddressService: true,
    memberAttributionService: true,
    getPostUrl: true,
    imageSize: true,
    outboundLinkTagger: true,
    settingsCache: true,
    labs: true,
    settingsHelpers: true,
    linkReplacer: true,
    storageUtils: true,
    linkTracking: true,
    urlUtils: true,
    imports: {
      createKeyForMember: true,
      formatPostPublishedAt: true,
      isValidLocale: true,
      darkenToContrastThreshold: true,
      htmlToPlaintext_email: true,
      logging: true,
      EmailAddressParser_stringify: true,
      makeRenderTemplate: true,
      formatDateLong: true,
      isUnsplashImage: true,
      textColorForBackgroundColor: true,
      "": true,
    },
    models: {
      Post: true,
      "": true,
    },
    renderers: {
      mobiledoc: true,
      lexical: true,
      "": true,
    },
  } satisfies ModulesDependencies,
} satisfies ModuleDescriptions;

type ModuleDescriptions = {
  [_ in string]: undefined | true | ModuleDescriptions;
};

export function modulesToEntries(
  modules: ModuleDescriptions,
  baseModule: string,
  fileRoot: string
): Record<string, string> {
  return Object.fromEntries(
    modulesToEntriesIterator(modules, baseModule).map((mod) => [
      mod,
      joinRelPath(fileRoot, mod),
    ])
  );
}

function modulesToEntriesIterator(
  modules: ModuleDescriptions,
  baseModule: string
): IteratorObject<string> {
  return Object.entries(modules)
    .values()
    .flatMap(([k, v]) => {
      if (!v) return [].values();
      const mod = joinRelPath(baseModule, k);
      if (v === true) return [mod].values();
      return modulesToEntriesIterator(v, mod);
    });
}

function joinRelPath(a: string, b: string) {
  if (a.length === 0) return b;
  if (b.length === 0) return a;

  if (a.endsWith("/")) {
    if (b.startsWith("/")) return a.slice(0, a.length - 1) + b;
    else return a + b;
  } else {
    if (b.startsWith("/")) return a + b;
    else return `${a}/${b}`;
  }
}

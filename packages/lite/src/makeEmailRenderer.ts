import EmailRenderer from "@ghost-render/email-renderer";
import * as imports from "./dependencies/imports";
import SettingsCache, { type Settings } from "./lib/SettingsCache";
import type { DependenciesSettingsHelpers } from "@ghost-render/email-renderer";
import imageSize from "./dependencies/imageSize";
import UrlUtils, { type UrlUtilsOptions } from "./lib/UrlUtils";
import storageUtils from "./dependencies/storageUtils";
import getPostUrl from "./dependencies/getPostUrl";
import linkReplacer from "./dependencies/linkReplacer";
import linkTracking from "./dependencies/linkTracking";
import memberAttributionService from "./dependencies/memberAttributionService";
import audienceFeedbackService from "./dependencies/audienceFeedbackService";
import emailAddressService from "./dependencies/emailAddressService";
import outboundLinkTagger from "./dependencies/outboundLinkTagger";
import Labs, { type LabsObject } from "./lib/Labs";
import * as models from "./dependencies/models";
import makeTFromResources, { type TResources } from "./lib/makeTFromResources";
import makeRenderers, { type MobiledocMakeRenderer } from "./lib/renderers";

export type { EmailRenderer };

export default function makeEmailRendererLite({
  settings,
  settingsHelpers,
  urlUtilsOptions,
  labs: labsValues,
  tResources,
  mobiledocMakeRenderer,
}: {
  settings: Settings;
  settingsHelpers: DependenciesSettingsHelpers;
  urlUtilsOptions: UrlUtilsOptions;
  labs: LabsObject;
  tResources: TResources;
  mobiledocMakeRenderer: MobiledocMakeRenderer | undefined;
}): EmailRenderer {
  const settingsCache = new SettingsCache(settings);
  const urlUtils = new UrlUtils(urlUtilsOptions);
  const labs = new Labs(labsValues);
  const makeT = () => makeTFromResources(tResources);
  return new EmailRenderer({
    imports,
    settingsCache,
    settingsHelpers,
    renderers: makeRenderers({
      getSiteUrl: urlUtilsOptions.getSiteUrl,
      labs,
      mobiledoc: mobiledocMakeRenderer
        ? {
            makeRenderer: mobiledocMakeRenderer,
            loggingError: imports.logging.error,
          }
        : undefined,
    }),
    imageSize,
    urlUtils,
    storageUtils,
    getPostUrl,
    linkReplacer,
    linkTracking,
    memberAttributionService,
    audienceFeedbackService,
    emailAddressService,
    outboundLinkTagger,
    labs,
    models,
    makeT,
  });
}

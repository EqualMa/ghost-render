import type { OverridableModuleDescriptions } from "@ghost-render/full/vite-config/common";
import { tsImport } from "tsx/esm/api";

const { MODULES, modulesToEntries } = (await tsImport(
  "@ghost-render/full/vite-config/common",
  import.meta.url
)) as typeof import("@ghost-render/full/vite-config/common");

export { modulesToEntries };

export const LITE_MODULES = {
  ...MODULES,
  dependencies: {
    ...MODULES.dependencies,
    makeT: undefined,
    settingsCache: undefined,
    labs: undefined,
    settingsHelpers: undefined,
    urlUtils: undefined,
    renderers: undefined,
  } satisfies OverridableModuleDescriptions["dependencies"],
  lib: {
    renderers: {
      "": true,
      lexical: true,
    },
    Labs: true,
    makeTFromResources: true,
    SettingsCache: true,
    UrlUtils: true,
  },
} as const;

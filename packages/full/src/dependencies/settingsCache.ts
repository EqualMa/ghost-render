import type { DependenciesSettingsCache } from "@ghost-render/email-renderer";
import settingsCache from "ghost/core/shared/settings-cache";
export default settingsCache as typeof settingsCache & {
  get: unknown;
} as DependenciesSettingsCache;

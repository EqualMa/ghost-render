import type { DependenciesSettingsCacheKnownField } from "ghost/core/server/services/email-service/EmailRenderer";
import makeFields from "../makeFields";

export type Settings = Record<DependenciesSettingsCacheKnownField, string>;

export default class SettingsCache extends makeFields<Settings, Settings>({
  title: (data) => data.title,
  locale: (data) => data.locale,
  timezone: (data) => data.timezone,
  accent_color: (data) => data.accent_color,
  icon: (data) => data.icon,
  comments_enabled: (data) => data.comments_enabled,
}) {}

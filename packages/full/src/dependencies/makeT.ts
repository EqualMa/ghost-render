import i18nLib from "@tryghost/i18n";
import type { DependenciesMakeT } from "ghost/core/server/services/email-service/EmailRenderer";

export default (function makeT({ labs, settingsCache }) {
  const i18nLanguage = labs.isSet("i18n")
    ? settingsCache.get("locale") || "en"
    : "en";
  const i18n = i18nLib(i18nLanguage, "ghost");
  return i18n.t;
} satisfies DependenciesMakeT as DependenciesMakeT);

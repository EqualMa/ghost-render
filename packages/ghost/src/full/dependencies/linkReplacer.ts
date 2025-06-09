import type { DependenciesLinkReplacer } from "ghost/core/server/services/email-service/EmailRenderer";
import linkReplacer from "ghost/core/server/services/lib/link-replacer";
// TODO: satisfies DependenciesLinkReplacer
export default linkReplacer as DependenciesLinkReplacer;

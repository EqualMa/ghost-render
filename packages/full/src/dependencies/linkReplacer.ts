import type { DependenciesLinkReplacer } from "@ghost-render/email-renderer";
import linkReplacer from "ghost/core/server/services/lib/link-replacer";
// TODO: satisfies DependenciesLinkReplacer
export default linkReplacer as DependenciesLinkReplacer;

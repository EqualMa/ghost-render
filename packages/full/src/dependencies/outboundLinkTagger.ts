import type { DependenciesOutboundLinkTagger } from "@ghost-render/email-renderer";
import memberAttribution from "ghost/core/server/services/member-attribution";

const outboundLinkTagger: DependenciesOutboundLinkTagger =
  memberAttribution.outboundLinkTagger;

export default outboundLinkTagger;

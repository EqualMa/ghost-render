import type { DependenciesOutboundLinkTagger } from "ghost/core/server/services/email-service/EmailRenderer";
import memberAttribution from "ghost/core/server/services/member-attribution";

const outboundLinkTagger: DependenciesOutboundLinkTagger =
  memberAttribution.outboundLinkTagger;

export default outboundLinkTagger;

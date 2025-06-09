import type { DependenciesOutboundLinkTagger } from "ghost/core/server/services/email-service/EmailRenderer";

const outboundLinkTagger: DependenciesOutboundLinkTagger = {
  addToUrl() {
    throw new Error("outboundLinkTagger.addToUrl not implemented");
  },
};

export default outboundLinkTagger;

import type { DependenciesOutboundLinkTagger } from "@ghost-render/email-renderer";

const outboundLinkTagger: DependenciesOutboundLinkTagger = {
  addToUrl() {
    throw new Error("outboundLinkTagger.addToUrl not implemented");
  },
};

export default outboundLinkTagger;

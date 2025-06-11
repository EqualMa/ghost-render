import type { DependenciesLinkTracking } from "@ghost-render/email-renderer";
const linkTracking: DependenciesLinkTracking = {
  service: {
    addTrackingToUrl() {
      throw new Error(`linkTracking.service.addTrackingToUrl not implemented`);
    },
  },
};

export default linkTracking;

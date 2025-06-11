import type { DependenciesLinkTracking } from "ghost/core/server/services/email-service/EmailRenderer";
const linkTracking: DependenciesLinkTracking = {
  service: {
    addTrackingToUrl() {
      throw new Error(`linkTracking.service.addTrackingToUrl not implemented`);
    },
  },
};

export default linkTracking;

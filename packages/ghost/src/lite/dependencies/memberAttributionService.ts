import type { DependenciesMemberAttributionService } from "ghost/core/server/services/email-service/EmailRenderer";

const memberAttributionService: DependenciesMemberAttributionService = {
  addPostAttributionTracking() {
    throw new Error(
      `memberAttributionService.addPostAttributionTracking not implemented`
    );
  },
};

export default memberAttributionService;

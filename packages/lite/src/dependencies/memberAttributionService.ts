import type { DependenciesMemberAttributionService } from "@ghost-render/email-renderer";

const memberAttributionService: DependenciesMemberAttributionService = {
  addPostAttributionTracking() {
    throw new Error(
      `memberAttributionService.addPostAttributionTracking not implemented`
    );
  },
};

export default memberAttributionService;

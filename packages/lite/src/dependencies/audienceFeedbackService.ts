import type { DependenciesAudienceFeedbackService } from "@ghost-render/email-renderer";

const audienceFeedbackService: DependenciesAudienceFeedbackService = {
  buildLink() {
    return { href: "" };
  },
};

export default audienceFeedbackService;

import type { DependenciesAudienceFeedbackService } from "ghost/core/server/services/email-service/EmailRenderer";

const audienceFeedbackService: DependenciesAudienceFeedbackService = {
  buildLink() {
    return { href: "" };
  },
};

export default audienceFeedbackService;

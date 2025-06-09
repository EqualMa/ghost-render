import type { DependenciesAudienceFeedbackService } from "ghost/core/server/services/email-service/EmailRenderer";
import audienceFeedback from "ghost/core/server/services/audience-feedback";
const audienceFeedbackService: DependenciesAudienceFeedbackService =
  audienceFeedback.service;
export default audienceFeedbackService;

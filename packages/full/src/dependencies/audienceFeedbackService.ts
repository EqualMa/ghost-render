import type { DependenciesAudienceFeedbackService } from "@ghost-render/email-renderer";
import audienceFeedback from "ghost/core/server/services/audience-feedback";
const audienceFeedbackService: DependenciesAudienceFeedbackService =
  audienceFeedback.service!;
export default audienceFeedbackService;

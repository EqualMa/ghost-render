import type { DependenciesMemberAttributionService } from "ghost/core/server/services/email-service/EmailRenderer";
import memberAttribution from "ghost/core/server/services/member-attribution";

const memberAttributionService: DependenciesMemberAttributionService =
  memberAttribution.service;

export default memberAttributionService;

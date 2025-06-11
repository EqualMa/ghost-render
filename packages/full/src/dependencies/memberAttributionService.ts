import type { DependenciesMemberAttributionService } from "@ghost-render/email-renderer";
import memberAttribution from "ghost/core/server/services/member-attribution";

const memberAttributionService: DependenciesMemberAttributionService =
  memberAttribution.service;

export default memberAttributionService;

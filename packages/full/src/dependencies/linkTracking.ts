import type { DependenciesLinkTracking } from "@ghost-render/email-renderer";
import linkTracking from "ghost/core/server/services/link-tracking";
export default linkTracking as typeof linkTracking & {
  service: {};
} satisfies DependenciesLinkTracking as DependenciesLinkTracking;

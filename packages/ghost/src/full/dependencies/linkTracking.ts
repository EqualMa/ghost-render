import type { DependenciesLinkTracking } from "ghost/core/server/services/email-service/EmailRenderer";
import linkTracking from "ghost/core/server/services/link-tracking";
export default linkTracking satisfies DependenciesLinkTracking as DependenciesLinkTracking;

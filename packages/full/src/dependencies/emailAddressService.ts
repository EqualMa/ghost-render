import type { DependenciesEmailAddressService } from "ghost/core/server/services/email-service/EmailRenderer";
import emailAddressService from "ghost/core/server/services/email-address";
export default emailAddressService satisfies DependenciesEmailAddressService as DependenciesEmailAddressService;

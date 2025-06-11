import type { DependenciesEmailAddressService } from "@ghost-render/email-renderer";
import emailAddressService from "ghost/core/server/services/email-address";
export default emailAddressService satisfies DependenciesEmailAddressService as DependenciesEmailAddressService;

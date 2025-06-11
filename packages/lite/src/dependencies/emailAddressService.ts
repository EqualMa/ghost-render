import type { DependenciesEmailAddressService } from "ghost/core/server/services/email-service/EmailRenderer";

const emailAddressService: DependenciesEmailAddressService = {
  getAddress() {
    throw new Error("emailAddressService.getAddress not implemented");
  },
  get managedEmailEnabled(): boolean {
    throw new Error("emailAddressService.managedEmailEnabled not implemented");
  },
};

export default emailAddressService;

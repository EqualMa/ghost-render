import type { DependenciesEmailAddressService } from "@ghost-render/email-renderer";

const emailAddressService: DependenciesEmailAddressService = {
  getAddress() {
    throw new Error("emailAddressService.getAddress not implemented");
  },
  get managedEmailEnabled(): boolean {
    throw new Error("emailAddressService.managedEmailEnabled not implemented");
  },
};

export default emailAddressService;

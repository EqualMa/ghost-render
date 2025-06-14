/// <reference types="ghost/core/server/services/recommendations/service/libraries" />

import type { DependenciesEmailAddressService } from "@ghost-render/email-renderer";

import emailAddressServiceWrapper from "ghost/core/server/services/email-address";
const emailAddressService: DependenciesEmailAddressService =
  emailAddressServiceWrapper.service;
export default emailAddressService;

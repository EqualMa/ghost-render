import type { Dependencies } from "@ghost-render/email-renderer";
import storageUtils from "ghost/core/server/adapters/storage/utils";
export default storageUtils satisfies Dependencies["storageUtils"] as Dependencies["storageUtils"];

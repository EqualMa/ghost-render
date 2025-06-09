import type { Dependencies } from "../../EmailRenderer";
import storageUtils from "ghost/core/server/adapters/storage/utils";
export default storageUtils satisfies Dependencies["storageUtils"] as Dependencies["storageUtils"];

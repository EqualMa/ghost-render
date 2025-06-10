import type { Dependencies } from "@ghost-render/email-renderer";

const storageUtils: Dependencies["storageUtils"] = {
  isLocalImage() {
    return false;
  },
};

export default storageUtils;

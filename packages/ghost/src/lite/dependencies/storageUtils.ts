import type { Dependencies } from "../../EmailRenderer";

const storageUtils: Dependencies["storageUtils"] = {
  isLocalImage() {
    return false;
  },
};

export default storageUtils;

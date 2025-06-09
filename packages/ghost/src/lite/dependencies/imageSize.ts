import type { Dependencies } from "../../EmailRenderer";

const imageSize: Dependencies["imageSize"] = {
  getImageSizeFromUrl() {
    throw new ImageSizeError();
  },
};

export default imageSize;

export class ImageSizeError extends Error {
  message = "imageSize.getImageSizeFromUrl not implemented";
}

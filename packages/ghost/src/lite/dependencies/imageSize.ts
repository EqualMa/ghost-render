import type { Dependencies } from "@ghost-render/email-renderer";

const imageSize: Dependencies["imageSize"] = {
  getImageSizeFromUrl() {
    throw new ImageSizeError();
  },
};

export default imageSize;

export class ImageSizeError extends Error {
  message = "imageSize.getImageSizeFromUrl not implemented";
}

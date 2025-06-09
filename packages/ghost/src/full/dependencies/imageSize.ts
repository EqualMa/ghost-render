import type { Dependencies } from "../../EmailRenderer";
import serverLibImage from "ghost/core/server/lib/image";

const { imageSize } = serverLibImage;

export default imageSize satisfies Dependencies["imageSize"] as Dependencies["imageSize"];

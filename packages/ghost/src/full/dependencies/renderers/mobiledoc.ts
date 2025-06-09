import type { Dependencies } from "../../../EmailRenderer";
import mobiledocLib from "ghost/core/server/lib/mobiledoc";
export default mobiledocLib as Dependencies["renderers"]["mobiledoc"];

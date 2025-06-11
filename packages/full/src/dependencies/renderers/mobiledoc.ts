import type { Dependencies } from "@ghost-render/email-renderer";
import mobiledocLib from "ghost/core/server/lib/mobiledoc";
export default mobiledocLib as Dependencies["renderers"]["mobiledoc"];

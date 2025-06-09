import type { Dependencies } from "../../EmailRenderer";
const getPostUrl: Dependencies["getPostUrl"] = (post) => post.get("url");
export default getPostUrl;

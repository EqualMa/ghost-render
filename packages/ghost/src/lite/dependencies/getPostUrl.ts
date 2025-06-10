import type { Dependencies } from "@ghost-render/email-renderer";
const getPostUrl: Dependencies["getPostUrl"] = (post) => post.get("url");
export default getPostUrl;

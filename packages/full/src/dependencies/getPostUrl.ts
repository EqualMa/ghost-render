import type { Dependencies } from "ghost/core/server/services/email-service/EmailRenderer";
import { forPost } from "ghost/core/server/api/endpoints/utils/serializers/output/utils/url";

export default (function getPostUrl(post) {
  const jsonModel = post.toJSON();
  forPost(post.id, jsonModel, { options: {} });
  return jsonModel.url;
} satisfies Dependencies["getPostUrl"]);

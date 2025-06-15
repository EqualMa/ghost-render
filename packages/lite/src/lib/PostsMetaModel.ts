import type {
  PostsMeta,
  PostsMetaKnownFields,
} from "@ghost-render/email-renderer";
import makeFields from "../makeFields";

export interface PostsMetaObject extends PostsMetaKnownFields {}

export default class PostsMetaModel
  extends makeFields<PostsMetaKnownFields, PostsMetaObject>({
    email_subject: (v) => v.email_subject,
    email_only: (v) => v.email_only,
    feature_image_alt: (v) => v.feature_image_alt,
    feature_image_caption: (v) => v.feature_image_caption,
  })
  implements PostsMeta {}

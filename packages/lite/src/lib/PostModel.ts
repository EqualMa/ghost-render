import type {
  Post,
  PostKnownFields,
  PostKnownLazyRelations,
  PostKnownRelations,
} from "@ghost-render/email-renderer";
import makeFields from "../makeFields";
import PostsMetaModel, { type PostsMetaObject } from "./PostsMetaModel";
import type { AuthorObject } from "./AuthorModel";
import AuthorModel from "./AuthorModel";

type MaybePromise<T> = Promise<T> | T;

export interface PostObject extends PostKnownFields {
  id: string;
  posts_meta: PostsMetaObject;
  queryAuthors(): MaybePromise<undefined | null | AuthorObject[]>;
}

export default class PostModel
  extends makeFields<PostKnownFields, PostObject>({
    lexical: (p) => p.lexical,
    mobiledoc: (p) => p.mobiledoc,
    visibility: (p) => p.visibility,
    feature_image: (p) => p.feature_image,
    title: (p) => p.title,
    custom_excerpt: (p) => p.custom_excerpt,
    plaintext: (p) => p.plaintext,
    published_at: (p) => p.published_at,
    url: (p) => p.url,
  })
  implements Post
{
  get id(): string {
    return this.__getData().id;
  }
  toJSON(): object {
    return this.__getData();
  }

  related<K extends keyof PostKnownRelations>(model: K): PostKnownRelations[K] {
    return relatedDefs[model](this.__getData());
  }

  getLazyRelation<K extends keyof PostKnownLazyRelations>(
    model: K
  ): MaybePromise<PostKnownLazyRelations[K]> {
    return lazyRelations[model](this.__getData());
  }
}

const relatedDefs: {
  [K in keyof PostKnownRelations]: (input: PostObject) => PostKnownRelations[K];
} = { posts_meta: (input) => new PostsMetaModel(input.posts_meta) };

const lazyRelations: {
  [K in keyof PostKnownLazyRelations]: (
    input: PostObject
  ) => Promise<PostKnownLazyRelations[K]>;
} = {
  authors: async (post) => {
    const authors = await post.queryAuthors();

    return authors
      ? {
          models: authors.map((author) => new AuthorModel(author)),
        }
      : null;
  },
};

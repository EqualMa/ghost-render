import type {
  DependenciesModelsPost,
  Post,
} from "ghost/core/server/services/email-service/EmailRenderer";

const ModelPost: DependenciesModelsPost = {
  findPage: (): Promise<{ data: Post[] }> => {
    throw new Error("models.Post.findPage not implemented");
  },
};

export default ModelPost;

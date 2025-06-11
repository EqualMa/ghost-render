import type {
  DependenciesModelsPost,
  Post,
} from "@ghost-render/email-renderer";

const ModelPost: DependenciesModelsPost = {
  findPage: (): Promise<{ data: Post[] }> => {
    throw new Error("models.Post.findPage not implemented");
  },
};

export default ModelPost;

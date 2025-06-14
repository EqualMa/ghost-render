import type { Author } from "@ghost-render/email-renderer";
import makeFields from "../makeFields";

export interface AuthorValues {
  name: string;
}

export default class AuthorModel
  extends makeFields<AuthorValues, AuthorValues>({ name: (v) => v.name })
  implements Author {}

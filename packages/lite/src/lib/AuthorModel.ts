import type { Author } from "@ghost-render/email-renderer";
import makeFields from "../makeFields";

export interface AuthorObject {
  name: string;
}

export default class AuthorModel
  extends makeFields<AuthorObject, AuthorObject>({ name: (v) => v.name })
  implements Author {}

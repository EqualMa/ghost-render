import type { Imports } from "@ghost-render/email-renderer";
import htmlToPlaintext_email from "../../reexports/@tryghost/html-to-plaintext/email";

export default htmlToPlaintext_email satisfies Imports["htmlToPlaintext_email"] as Imports["htmlToPlaintext_email"];

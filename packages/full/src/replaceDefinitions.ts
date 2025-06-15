import type {
  MemberLike,
  ReplacementDefinition,
} from "@ghost-render/email-renderer";

type OriginalReplaceDefinitions =
  typeof import("ghost/core/server/services/email-service/EmailService.js")["prototype"]["replaceDefinitions"];
// EmailService.prototype.replaceDefinitions;

export type { ReplacementDefinition };

/**
 * replaceDefinitions with lazy getValue
 */
export default (function replaceDefinitions(
  htmlOrPlaintext: string,
  replacements: ReplacementDefinition[],
  member: MemberLike
) {
  // Do manual replacements with an example member
  for (const replacement of replacements) {
    let value;
    htmlOrPlaintext = htmlOrPlaintext.replace(
      replacement.token,
      // lazy getValue
      () => (value ??= { inner: replacement.getValue(member) }).inner
    );
  }
  return htmlOrPlaintext;
} satisfies OriginalReplaceDefinitions);

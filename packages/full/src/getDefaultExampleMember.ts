import type { MemberLike } from "@ghost-render/email-renderer";
import _getDefaultExampleMember from "./_getDefaultExampleMember";

export type { MemberLike };

const getDefaultExampleMember: (
  segment?: "status:free" | (string & {})
) => MemberLike = _getDefaultExampleMember;

export default getDefaultExampleMember;

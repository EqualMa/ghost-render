import crypto from "node:crypto";

export default function createKeyForMember(
  getMembersValidationKeyFromSettingsHelpers: () => string,
  memberUUID: string
): string {
  return crypto
    .createHmac("sha256", getMembersValidationKeyFromSettingsHelpers())
    .update(memberUUID)
    .digest("hex");
}

import type { Imports } from "@ghost-render/email-renderer";

const formatPostPublishedAt: Imports["formatPostPublishedAt"] = (date) =>
  date ? date.toISOString().split("T")[0] : "";

export default formatPostPublishedAt;

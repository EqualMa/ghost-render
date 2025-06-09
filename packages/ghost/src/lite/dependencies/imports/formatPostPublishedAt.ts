import type { Imports } from "../../../EmailRenderer";

const formatPostPublishedAt: Imports["formatPostPublishedAt"] = (date) =>
  date ? date.toISOString().split("T")[0] : "";

export default formatPostPublishedAt;

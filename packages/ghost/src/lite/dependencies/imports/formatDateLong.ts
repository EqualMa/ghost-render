import type { Imports } from "@ghost-render/email-renderer";

const formatDateLong: Imports["formatDateLong"] = (date) => date.toISOString();

export default formatDateLong;

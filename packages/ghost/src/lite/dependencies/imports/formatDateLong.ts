import type { Imports } from "../../../EmailRenderer";

const formatDateLong: Imports["formatDateLong"] = (date) => date.toISOString();

export default formatDateLong;

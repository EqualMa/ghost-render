import type { ImportsLogging } from "ghost/core/server/services/email-service/EmailRenderer";
import { ImageSizeError } from "../imageSize";

const logging: ImportsLogging = {
  error: (msg: unknown) => {
    if (msg instanceof ImageSizeError) {
      // ignore this error
      return;
    }
    console.error(msg);
  },
  warn: console.warn,
};

export default logging;

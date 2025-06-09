// @ts-check

import * as fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const stylesHbsUrl = import.meta.resolve(
  "ghost/core/server/services/email-service/email-templates/partials/styles.hbs"
);

const stylesHbsPath = fileURLToPath(stylesHbsUrl);

const styleHbsSource = await fs.readFile(stylesHbsPath, "utf-8");

console.assert(typeof styleHbsSource === "string");

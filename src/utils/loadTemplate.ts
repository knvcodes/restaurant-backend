import handlebars from "handlebars";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadTemplate(name: string) {
  const file = await fs.readFile(
    join(__dirname, "../templates", `${name}.hbs`),
    "utf-8",
  );
  return handlebars.compile(file);
}

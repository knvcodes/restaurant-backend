// ── Swagger Config ─────────────────────────────────────
// Loads every `<module>/<module>.swagger.yaml` from src/modules,
// merges them into a single OpenAPI 3.0 spec, and exposes it to
// swagger-ui-express in server.ts.

import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

// Resolve paths relative to this file (ESM-safe, no __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const MODULES_DIR = join(__dirname, "..", "modules");

// ── Types ──────────────────────────────────────────────

interface OpenAPITag {
  name: string;
  description?: string;
}

interface OpenAPIServer {
  url: string;
  description?: string;
}

interface OpenAPISpec {
  openapi: string;
  info: Record<string, unknown>;
  tags?: OpenAPITag[];
  servers?: OpenAPIServer[];
  paths: Record<string, unknown>;
  components?: { schemas?: Record<string, unknown> };
  [key: string]: unknown;
}

// ── Helpers ────────────────────────────────────────────

function loadSwaggerFile(filePath: string): OpenAPISpec {
  const fileContents = readFileSync(filePath, "utf8");
  return yaml.load(fileContents) as OpenAPISpec;
}

// ── Public API ─────────────────────────────────────────

export function buildSwaggerSpec(): OpenAPISpec {
  // 1. Discover module directories under src/modules
  const moduleDirs = readdirSync(MODULES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  // 2. Load every <module>/*.swagger.yaml file we find
  const moduleSpecs: OpenAPISpec[] = [];
  for (const dir of moduleDirs) {
    const dirPath = join(MODULES_DIR, dir);
    const files = readdirSync(dirPath);
    const swaggerFile = files.find((f) => f.endsWith(".swagger.yaml"));
    if (swaggerFile) {
      moduleSpecs.push(loadSwaggerFile(join(dirPath, swaggerFile)));
    }
  }

  // 3. Build the merged spec (top-level info/servers override per-module values)
  const merged: OpenAPISpec = {
    openapi: "3.0.3",
    info: {
      title: "Restaurant Management API",
      version: "1.0.0",
      description:
        "Combined API documentation for the restaurant management backend. All paths are relative to /api.",
    },
    servers: [
      { url: "http://localhost:3000/api", description: "Local dev server" },
    ],
    tags: [],
    paths: {},
    components: { schemas: {} },
  };

  // 4. Merge each module spec into the combined spec
  for (const spec of moduleSpecs) {
    if (spec.tags) merged.tags!.push(...spec.tags);
    if (spec.paths) Object.assign(merged.paths, spec.paths);
    if (spec.components?.schemas) {
      Object.assign(merged.components!.schemas!, spec.components.schemas);
    }
  }

  return merged;
}

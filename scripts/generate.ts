import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const name = process.argv[2];
const overwriteFiles = process.argv[3];

if (!name) {
  console.error("Provide module name: npm run generate dishes");
  process.exit(1);
}

const basePath = path.resolve(__dirname, "..");
const modulePath = path.join(
  basePath,
  process.env.MODULE_PATH || "src/modules",
  name,
);

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const entity = capitalize(name);

// Prevent overwrite
if (fs.existsSync(modulePath) && overwriteFiles == undefined) {
  console.error(`Module "${name}" already exists. Try again with a new name.`);
  process.exit(1);
}

// File paths
const controllerPath = path.join(modulePath, `${name}.controller.ts`);
const servicePath = path.join(modulePath, `${name}.service.ts`);
const routesPath = path.join(modulePath, `${name}.routes.ts`);
const modelPath = path.join(modulePath, `${name}.model.ts`);

// Templates

const controllerTemplate = `
import { Request, Response } from "express";
import * as ${entity}Service from "./${name}.service";
import { handleResponse } from "utils/helpers";
import logger from "utils/logger";



export const ${name}sListing = async (req: Request, res: Response) => {
  try {
    // handleResponse(res, "List of ${name}");
  } catch (error) {
    logger.error({
      message: "Error in ${name}Listing",
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    res.status(500).json({
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
};


`;

const serviceTemplate = `
import logger from "utils/logger";
import { withLocation } from "utils/loggerHelper";
import { Request } from "express";

export const getAll = async (req: Request) => {
  try {
   
  } catch (error) {
    logger.error(withLocation("error:====>", error));
  }
};


`;

const routesTemplate = `
import express from "express";
import { ${name}sListing } from "./${name}.controller";

const ${name}Router = express.Router();

${name}Router.get("/list", ${name}sListing);

export default ${name}Router;
`;

const modelTemplate = `
import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface
export interface I${entity} extends Document {
  name: string;
  description?: string;
  age?: number;
  isActive: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
  profile: Record<string, unknown>;
  items: Record<string, unknown>[];
  userId?: Types.ObjectId; // ✅ relation type
}

// Schema
const ${entity}Schema: Schema<I${entity}> = new Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 50 },

    description: { type: String, minlength: 3, maxlength: 50 },

    age: { type: Number },

    isActive: { type: Boolean, default: true },

    tags: [{ type: String }],

    metadata: { type: Schema.Types.Mixed },

    // Example nested object
    profile: {
      firstName: { type: String },
      lastName: { type: String },
    },

    // Example array of objects
    items: [
      {
        title: { type: String },
        value: { type: Number },
      },
    ],

    // Example reference (relation)
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Model
const ${entity}: Model<I${entity}> = mongoose.model<I${entity}>(
  "${entity}",
  ${entity}Schema
);

export default ${entity};
`;

// Create module folder
fs.mkdirSync(modulePath, { recursive: true });

// Write files
fs.writeFileSync(controllerPath, controllerTemplate.trim());
fs.writeFileSync(servicePath, serviceTemplate.trim());
fs.writeFileSync(routesPath, routesTemplate.trim());
fs.writeFileSync(modelPath, modelTemplate.trim());

console.log(
  `Module "${name}" created inside src/modules. Try not to mess it up.`,
);

import mongoose from "mongoose";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.resolve(__dirname, "..");

const loadModels = async () => {
  const modulesPath = path.join(basePath, "modules");

  const modules = fs.readdirSync(modulesPath);

  for (const moduleName of modules) {
    const ext = process.env.NODE_ENV === "production" ? "js" : "ts";

    const modelPath = path.join(
      modulesPath,
      moduleName,
      `${moduleName}.model.${ext}`,
    );

    if (fs.existsSync(modelPath)) {
      // dynamic import (ESM)
      await import(modelPath);
    }
  }
};

export const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected!");

    await loadModels();

    // Auto sync indexes (important)
    await mongoose.connection.syncIndexes();
    console.log("🔄 Indexes synced");
    console.log("Loaded models:", mongoose.modelNames());
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Stop the server if DB fails
  }
};

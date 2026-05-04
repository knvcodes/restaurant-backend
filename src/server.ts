import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db.ts";
import logger from "./utils/logger.ts";
import router from "routes.ts";
import dotenv from "dotenv";
import StorageService from "services/storage.service.ts";
import ImageService from "services/image.service.ts";
import { BUCKET_NAME, s3Client } from "config/s3.ts";

// integrate env
dotenv.config();

const PORT = 3000;
const app = express();

// Enable CORS
app.use(
  cors({
    origin: ["http://localhost:3001", "http://127.0.0.1:3001"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // optional if you send cookies or auth headers
  }),
);

// Middleware to parse JSON
app.use(express.json());

// STARTUP
(async () => {
  try {
    // Log env inside async block

    // Initialize MinIO
    const storageService = new StorageService(s3Client, BUCKET_NAME);

    console.log("⏳ Checking MinIO bucket...");
    await storageService.ensureBucketExists();
    console.log("✓ MinIO connected");

    // Make services available to routes
    const imageService = new ImageService(storageService);
    app.locals.imageService = imageService;
    app.locals.storageService = storageService;

    // Connect MongoDB
    connectDB();

    // Routes
    app.get("/", (req: Request, res: Response) => {
      res.send("Hello from Express + Docker!");
    });

    app.use("/api", router);

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (err: any) {
    console.error("✗ Startup failed:", err.message);
    console.error("Stack:", err.stack);
    process.exit(1);
  }
})();

import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// integrate env
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import logger from "./utils/logger.js";
import router from "./routes.js";
import StorageService from "./services/storage.service.js";
import ImageService from "./services/image.service.js";
import { BUCKET_NAME, s3Client } from "./config/s3.js";
import { globalErrorHandler } from "./utils/errors.js";
import swaggerUi from "swagger-ui-express";
import { buildSwaggerSpec } from "./docs/swagger.config.js";

const PORT = 3000;
const app = express();

// Enable CORS
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:4173",
      "http://127.0.0.1:3001",
      process.env.PROD_FRONTEND_URL!,
    ],
    credentials: true, // optional if you send cookies or auth headers
  }),
);

app.use(cookieParser());

// Middleware to parse JSON
app.use(express.json());

// STARTUP
(async () => {
  try {
    // Log env inside async block

    // Initialize MinIO
    const storageService = new StorageService(s3Client, BUCKET_NAME);

    console.log("⏳ Checking MinIO bucket...");
    // await storageService.ensureBucketExists();
    console.log("✓ MinIO connected");

    // Make services available to routes
    const imageService = new ImageService(storageService);
    app.locals.imageService = imageService;
    app.locals.storageService = storageService;

    // Connect MongoDB
    await connectDB();

    // Connect Redis
    // await connectRedis();

    // Routes
    app.get("/", (_req: Request, res: Response) => {
      res.send("Hello from Express + Docker!");
    });

    // Build OpenAPI spec once at startup and mount Swagger UI
    const swaggerSpec = buildSwaggerSpec();
    app.use(
      "/api/docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        customSiteTitle: "Restaurant API Docs",
      }),
    );
    logger.info(`📚 Swagger UI live at http://localhost:${PORT}/api/docs`);

    app.use("/api", router);

    // Global error handler
    app.use(globalErrorHandler);

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

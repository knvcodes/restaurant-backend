import express, { Request, Response } from "express";
import cors from "cors"; // <-- import cors
import { connectDB } from "./config/db.ts";
import logger from "./utils/logger.ts";
import { withLocation } from "./utils/loggerHelper.ts";
import router from "routes.ts";

const PORT = 3000;
const app = express();

// Enable CORS
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://127.0.0.1:3001", // add this
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // optional if you send cookies or auth headers
  })
);

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express + Yarn!");
});

// API routes
app.use("/api", router);

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

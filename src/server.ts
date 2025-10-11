
import express, { Request, Response } from "express";
import { connectDB } from "./config/db.ts";
import logger from './utils/logger.ts'
import { withLocation } from "./utils/loggerHelper.ts";
import router from "routes.ts";
const PORT = 3000;
const app = express();

// Middleware to parse JSON
app.use(express.json())


// connect to mongo
connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express + Yarn!");
});

// defining routes
app.use('/api', router)  // All routes in router will be prefixed with /api

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(withLocation("1233 ==> ", 12333));
});



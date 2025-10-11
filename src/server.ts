
import express, { Request, Response } from "express";
import { connectDB } from "./config/db.ts";
import logger from './utils/logger.ts'
import { withLocation } from "./utils/loggerHelper.ts";
const PORT = 3000;
const app = express();


// connect to mongo
connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express + Yarn!");
});

// defining routes

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(withLocation("1233 ==> ", 12333));
});



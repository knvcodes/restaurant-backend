import { Request, Response } from "express";
import * as UploadService from "./upload.service";
import { handleResponse } from "utils/helpers";
import logger from "utils/logger";



export const uploadsListing = async (req: Request, res: Response) => {
  try {
    // handleResponse(res, "List of upload");
  } catch (error) {
    logger.error({
      message: "Error in uploadListing",
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
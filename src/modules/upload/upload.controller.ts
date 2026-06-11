import { NextFunction, Request, Response } from "express";
import * as UploadService from "./upload.service";
import { handleResponse } from "utils/helpers";
import logger from "utils/logger";

export const uploadsListing = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
    next(error);
  }
};

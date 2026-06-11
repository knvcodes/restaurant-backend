import { NextFunction, Request, Response } from "express";
import * as SupplementsService from "./supplements.service";
import { handleResponse } from "utils/helpers";
import logger from "utils/logger";

export const supplementssListing = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // handleResponse(res, "List of supplements");
  } catch (error) {
    logger.error({
      message: "Error in supplementsListing",
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    next(error);
  }
};

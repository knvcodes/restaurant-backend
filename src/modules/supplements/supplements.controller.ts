import { NextFunction, Request, Response } from "express";
import logger from "../../utils/logger.js";

export const supplementssListing = async (
  req: Request,
  _res: Response,
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

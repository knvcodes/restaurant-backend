import { Request, Response } from "express";
import * as SupplementsService from "./supplements.service";
import { handleResponse } from "utils/helpers";
import logger from "utils/logger";



export const supplementssListing = async (req: Request, res: Response) => {
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
    res.status(500).json({
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
};
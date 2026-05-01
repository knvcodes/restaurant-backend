import { Request, Response } from "express";
import * as DishesService from "./dishes.service";
import { handleResponse } from "utils/helpers";
import logger from "utils/logger";



export const dishessListing = async (req: Request, res: Response) => {
  try {
    // handleResponse(res, "List of dishes");
  } catch (error) {
    logger.error({
      message: "Error in dishesListing",
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
import { Request, Response, NextFunction } from "express";
import * as UsersService from "./users.service";
import { handleResponse } from "utils/helpers";
import logger from "utils/logger";

export const userssListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // handleResponse(res, "List of users");
  } catch (error) {
    logger.error({
      message: "Error in usersListing",
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    next(error);

  }
};
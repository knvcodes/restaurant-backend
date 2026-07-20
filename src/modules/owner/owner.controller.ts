import { NextFunction, Request, Response } from "express";
import { message } from "../../utils/messages.js";
import { handleResponse } from "../../utils/helpers.js";
import logger from "../../utils/logger.js";
import { ownerDashboardData } from "./owner.service.js";

export const ownerDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await ownerDashboardData(req);
    handleResponse(res, message.success.user.updateAvatar, data);
  } catch (error) {
    logger.error({
      message: "Error in ownerDashboard",
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    next(error);
  }
};

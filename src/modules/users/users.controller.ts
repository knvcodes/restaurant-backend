import { Response, NextFunction, Request } from "express";
import logger from "../../utils/logger.js";
import { handleResponse } from "../../utils/helpers.js";
import { message } from "../../utils/messages.js";
import { getUserProfile, updateUserAvatar } from "./users.service.js";

export const updateAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await updateUserAvatar(req);
    handleResponse(res, message.success.user.updateAvatar);
  } catch (error) {
    logger.error({
      message: "Error in updateAvatar",
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    next(error);
  }
};

export const userProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getUserProfile(req);
    handleResponse(res, message.success.user.updateAvatar, user);
  } catch (error) {
    logger.error({
      message: "Error in updateAvatar",
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    next(error);
  }
};

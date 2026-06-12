import { Request, Response, NextFunction } from "express";
import { handleResponse } from "utils/helpers";
import logger from "utils/logger";
import { message } from "utils/messages";
import { loginOwner, registerOwner } from "./owner.service";

export const ownerRegister = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await registerOwner(req);
    handleResponse(res, message.success.owner.registerSuccess);
  } catch (error) {
    logger.error({
      message: "Error in ownerRegister",
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    next(error);
  }
};

export const ownerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerTokens = await loginOwner(req);
    handleResponse(res, message.success.owner.loginSuccess, ownerTokens);
  } catch (error) {
    logger.error({
      message: "Error in ownerLogin",
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    next(error);
  }
};

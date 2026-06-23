import { Request, Response, NextFunction } from "express";
import { handleResponse } from "utils/helpers";
import logger from "utils/logger";
import { message } from "utils/messages";
import { login, oauthLogin, register } from "./auth.service";
import { setTokenCookies } from "services/jwt.service";

export const authRegister = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await register(req);
    handleResponse(res, message.success.user.registerSuccess);
  } catch (error) {
    logger.error({
      message: "Error in authRegister",
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    next(error);
  }
};

export const oauthRegister = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { tokens, userPayload } = await oauthLogin(req);
    setTokenCookies(res, tokens);
    handleResponse(res, message.success.user.registerSuccess, userPayload);
  } catch (error) {
    logger.error({
      message: "Error in oauthLogin",
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    next(error);
  }
};

export const authLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { tokens, userPayload } = await login(req, res);
    setTokenCookies(res, tokens);
    handleResponse(res, message.success.user.loginSuccess, userPayload);
  } catch (error) {
    logger.error({
      message: "Error in authLogin",
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    next(error);
  }
};

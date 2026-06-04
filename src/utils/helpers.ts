import { Response } from "express";
import { restaurantDescriptions } from "./staticData";
import logger from "./logger";
import { withLocation } from "./loggerHelper";

export const handleResponse = (res: Response, msg: string, data?: unknown) => {
  res.json({
    message: msg,
    data: data || null,
  });
};

export const errorLogger = (arg: unknown) => {
  logger.error(withLocation(`${arg}====>`, arg));
};

import { Request } from "express";
import logger from "../../utils/logger.js";
import { withLocation } from "../../utils/loggerHelper.js";

export const getAll = async (_req: Request) => {
  try {
  } catch (error) {
    logger.error(withLocation("error:====>", error));
  }
};

import logger from "utils/logger";
import { withLocation } from "utils/loggerHelper";
import { Request } from "express";

export const getAll = async (req: Request) => {
  try {
   
  } catch (error) {
    logger.error(withLocation("error:====>", error));
  }
};
import { NextFunction, Request, Response } from "express";
import * as DishesService from "./dishes.service.js";
import { handleResponse } from "../../utils/helpers.js";
import logger from "../../utils/logger.js";
import { message } from "../../utils/messages.js";

export const dishesListing = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dishes = await DishesService.dishesListing(req);
    handleResponse(res, "Dishes listed successfully", dishes);
  } catch (error) {
    logger.error({
      message: "Error in dishesListing",
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    next(error);
  }
};

export const addDish = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const addDish = await DishesService.addDish(req);
    handleResponse(res, message.success.addDish, addDish);
  } catch (error) {
    logger.error({
      message: "Error in addDish controller",
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    next(error);
  }
};

import { Request, Response } from "express";
import * as DishesService from "./dishes.service";
import { handleResponse } from "utils/helpers";
import logger from "utils/logger";
import { message } from "utils/messages";

export const dishesListing = async (req: Request, res: Response) => {
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
    res.status(500).json({
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
};

export const addDish = async (req: Request, res: Response) => {
  try {
    console.log("123:===>", 123);
    // const addDish = await DishesService.addDish(req);
    handleResponse(res, message.success.addDish);
  } catch (error) {
    logger.error({
      message: "Error in addDish controller",
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

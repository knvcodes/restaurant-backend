import { NextFunction, Request, Response } from "express";
import { listRestaurants, RestaurantDetail } from "./restaurant.service.js";
import { handleResponse } from "../../utils/helpers.js";
import { message } from "../../utils/messages.js";
import logger from "../../utils/logger.js";

export const restaurantsListing = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const list = await listRestaurants(req);
    handleResponse(res, message.success.restaurant.fetch, list);
  } catch (error) {
    logger.error({
      message: "Error in restaurantsListing",
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    next(error);
  }
};

export const restaurantDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const foundRestaurant = await RestaurantDetail(req);
    handleResponse(res, message.success.restaurant.detail, foundRestaurant);
  } catch (error) {
    logger.error({
      message: "Error in restaurantDetails",
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      route: req.originalUrl,
      method: req.method,
      body: req.body,
    });
    next(error);
  }
};

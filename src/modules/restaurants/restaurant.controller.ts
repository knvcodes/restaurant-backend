import { Request, Response } from "express";
import logger from "utils/logger";
import { listRestaurants, RestaurantDetail } from "./restaurant.service";
import { handleResponse } from "utils/helpers";

export const restaurantsListing = async (req: Request, res: Response) => {
  try {
    console.log("req.query===>", req.query);

    // Your main logic here
    const list = await listRestaurants(req);
    handleResponse(res, "List of restaurants", list);
  } catch (error) {
    logger.error({
      message: "Error in restaurantsListing",
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

export const restaurantDetails = async (req: Request, res: Response) => {
  try {
    // Your main logic here
    const foundRestaurant = await RestaurantDetail(req);
    handleResponse(res, "Restaurant details", foundRestaurant);
  } catch (error) {
    logger.error({
      message: "Error in restaurantDetails",
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

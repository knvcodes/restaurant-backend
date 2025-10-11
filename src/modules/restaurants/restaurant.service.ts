import logger from "utils/logger";
import { withLocation } from "utils/loggerHelper";
import Restaurant from "./restaurant.model";
import { Request } from "express";

export const listRestaurants = async(req: Request) => {
  try {
    const list = await Restaurant.find({},{_id: 0, address: 1, borough: 1, cuisine: 1, grades: 1, name: 1, restaurant_id: 1}).limit(10)
    logger.info(JSON.stringify(list, null, 2));
  } catch (error) {
    logger.error(withLocation("error:====>", error));
  }

};
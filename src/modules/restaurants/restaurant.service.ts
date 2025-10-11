import logger from "utils/logger";
import { withLocation } from "utils/loggerHelper";
import Restaurant from "./restaurant.model";

export const listRestaurants = async() => {
  try {
    const list = await Restaurant.find({})
    logger.info(JSON.stringify(list, null, 2));
  } catch (error) {
    logger.error(withLocation("error:====>", error));
  }

};
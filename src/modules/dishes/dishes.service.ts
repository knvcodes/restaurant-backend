import logger from "utils/logger";
import { withLocation } from "utils/loggerHelper";
import { Request } from "express";
import Restaurants from "modules/restaurants/restaurant.model";
import { NotFoundError } from "utils/errors";
import { message } from "utils/messages";
import Dishes from "./dishes.model";

export const addDish = async (req: Request) => {
  try {
    const {
      restaurantId,
      name,
      description,
      isActive = true,
      tags,
      serving,
      supplements,
    } = req.body;

    // throw error if no restaurant
    const findRestaurant = await Restaurants.findById(restaurantId);

    if (!findRestaurant) {
      throw new NotFoundError(message.failed.restaurantNotFound);
    }

    // add new dish

    const newDish = await Dishes.create({
      restaurantId,
      name,
      description,
      isActive,
      tags,
      serving,
      supplements,
    });

    return newDish;
  } catch (error) {
    logger.error(withLocation("error:====>", error));
  }
};

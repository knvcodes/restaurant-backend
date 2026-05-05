import logger from "utils/logger";
import { withLocation } from "utils/loggerHelper";
import Restaurant from "./restaurant.model";
import { Request } from "express";

export const listRestaurants = async (req: Request) => {
  try {
    const { search = null, limit = 10 } = <Record<string, string | number>>(
      req.query
    );

    let where = <
      Record<string, string | number | Record<string, string | number>>
    >{};

    if (search) {
      where.name = { $like: search };
    }

    console.log("where===>", where);

    const list = await Restaurant.find(
      {
        ...where,
      },
      {
        _id: 0,
        address: 1,
        borough: 1,
        cuisine: 1,
        grades: 1,
        name: 1,
        restaurant_id: 1,
        cancellationFee: 1,
        deliveryFee: 1,
        deliveryHours: 1,
        minimumDelivery: 1,
        openDays: 1,
      },
    ).limit(Number(limit));
    return list;
  } catch (error) {
    logger.error(withLocation("error:====>", error));
  }
};

export const RestaurantDetail = async (req: Request) => {
  try {
    const { id } = req.params;

    const foundRestaurant = await Restaurant.findOne(
      {
        restaurant_id: id,
      },
      {
        _id: 0,
        address: 1,
        borough: 1,
        cuisine: 1,
        grades: 1,
        name: 1,
        restaurant_id: 1,
        cancellationFee: 1,
        deliveryFee: 1,
        deliveryHours: 1,
        minimumDelivery: 1,
        openDays: 1,
      },
    ).limit(10);

    console.info("foundRestaurant===>", foundRestaurant);

    return foundRestaurant;
  } catch (error) {
    logger.error(withLocation("error:====>", error));
  }
};

import logger from "utils/logger";
import { withLocation } from "utils/loggerHelper";
import Restaurant from "./restaurant.model";
import { Request } from "express";
import { errorLogger } from "utils/helpers";

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

    console.log("where 11===>", where);

    const list = await Restaurant.find(
      {
        ...where,
      },
      {
        // _id: 0,
      },
    ).limit(Number(limit));
    return list;
  } catch (error) {
    errorLogger(error);
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
      },
    ).limit(10);

    console.info("foundRestaurant===>", foundRestaurant);

    return foundRestaurant;
  } catch (error) {
    errorLogger(error);
  }
};

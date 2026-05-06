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
      | Record<string, string | number | Record<string, string | number>>
      | Record<string, unknown>[]
    >{};

    if (search) {
      where["$or"] = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const list = await Restaurant.find({
      ...where,
    }).limit(Number(limit));
    return list;
  } catch (error) {
    errorLogger(error);
  }
};

export const RestaurantDetail = async (req: Request) => {
  try {
    const { id } = req.params;

    const foundRestaurant = await Restaurant.findOne({
      restaurant_id: id,
    }).limit(10);

    console.info("foundRestaurant===>", foundRestaurant);

    return foundRestaurant;
  } catch (error) {
    errorLogger(error);
  }
};

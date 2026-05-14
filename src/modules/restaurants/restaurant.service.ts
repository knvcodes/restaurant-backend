import logger from "utils/logger";
import { withLocation } from "utils/loggerHelper";
import Restaurant from "./restaurant.model";
import { Request } from "express";
import { errorLogger } from "utils/helpers";
import mongoose from "mongoose";
import { title } from "process";

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

    const foundRestaurant = await Restaurant.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "dishes",
          as: "dishes",
          localField: "_id",
          foreignField: "restaurantId",
          pipeline: [
            {
              $match: {
                isActive: { $eq: true },
              },
            },
            {
              $project: {
                name: 1,
                tags: 1,
                serving: {
                  title: 1,
                  price: 1,
                  currency: 1,
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          grades: 0,
          name: 1,
          address: {
            coord: 0,
          },
        },
      },
    ]);

    console.info("foundRestaurant===>", foundRestaurant);

    return foundRestaurant;
  } catch (error) {
    errorLogger(error);
  }
};

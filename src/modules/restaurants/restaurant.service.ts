import Restaurant from "./restaurant.model";
import { Request } from "express";
import mongoose, { FilterQuery } from "mongoose";
import { NotFoundError } from "utils/errors";
import { message } from "utils/messages";

export const listRestaurants = async (req: Request) => {
  const { search = null, limit = 10 } = <Record<string, string | number>>(
    req.query
  );

  const where: FilterQuery<typeof Restaurant> = {};

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
};

export const RestaurantDetail = async (req: Request) => {
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
      },
    },
    {
      $project: {
        grades: 0,
      },
    },
  ]).limit(1);

  if (!foundRestaurant[0]) {
    throw new NotFoundError(message.failed.restaurantNotFound);
  }

  return foundRestaurant[0];
};

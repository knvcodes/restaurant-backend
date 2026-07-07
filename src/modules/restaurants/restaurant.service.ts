import { Request } from "express";
import mongoose, { FilterQuery } from "mongoose";
import { toRestaurantResponseDto } from "./restaurant.dto.js";
import { NotFoundError } from "../../utils/errors.js";
import { message } from "../../utils/messages.js";
import Restaurants from "./restaurant.model.js";

export const listRestaurants = async (req: Request) => {
  const { search = null, limit = 10 } = <Record<string, string | number>>(
    req.query
  );

  const where: FilterQuery<typeof Restaurants> = {};

  if (search) {
    where["$or"] = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const list = await Restaurants.find({
    ...where,
  }).limit(Number(limit));

  return list.map(toRestaurantResponseDto);
};

export const RestaurantDetail = async (req: Request) => {
  const { id } = req.params;

  const foundRestaurant = await Restaurants.aggregate([
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

  return toRestaurantResponseDto(foundRestaurant[0]);
};

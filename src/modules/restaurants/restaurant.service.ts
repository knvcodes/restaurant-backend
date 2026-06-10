import Restaurant from "./restaurant.model";
import { Request } from "express";
import { FilterQuery } from "mongoose";

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

  console.info("list:===>", list);
  return list;
};

export const RestaurantDetail = async (req: Request) => {
  const { id } = req.params;

  const foundRestaurant = await Restaurant.aggregate([
    {
      $match: { restaurant_id: id },
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
        ],
      },
    },
  ]).limit(1);

  console.info("foundRestaurant===>", foundRestaurant[0]);

  return foundRestaurant[0];
};

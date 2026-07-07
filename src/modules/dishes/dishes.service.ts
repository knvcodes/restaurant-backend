import { Request } from "express";
import Restaurants from "../restaurants/restaurant.model.js";
import { NotFoundError } from "../../utils/errors.js";
import { message } from "../../utils/messages.js";
import Dishes from "./dishes.model.js";

export const addDish = async (req: Request) => {
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
};

export const dishesListing = async (req: Request) => {
  try {
    const { page = 1, limit = 10, search, restaurantId } = req.query;

    const query: any = {};

    // Filter by restaurantId
    if (restaurantId) {
      query.restaurantId = restaurantId;
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Pagination
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const dishes = await Dishes.find(query)
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const total = await Dishes.countDocuments(query);

    return {
      dishes,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  } catch (error: unknown) {
    throw error;
  }
};

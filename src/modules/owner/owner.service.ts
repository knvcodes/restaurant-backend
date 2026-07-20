import { Request } from "express";
import Restaurants from "../restaurants/restaurant.model.js";
import mongoose from "mongoose";
import { NotFoundError } from "../../utils/errors.js";
import { toRestaurantResponseDto } from "./owner.dto.js";

export const ownerDashboardData = async (req: Request) => {
  try {
    const user = req.user;

    console.info("user:===>", user);

    const restaurantsOwned = await Restaurants.find({
      owner_id: new mongoose.Types.ObjectId(user?.id),
    });

    if (restaurantsOwned.length == 0) {
      throw new NotFoundError("restaurants not found for loggedin user");
    } else {
      return restaurantsOwned.map(toRestaurantResponseDto);
    }
  } catch (error: unknown) {
    throw error;
  }
};

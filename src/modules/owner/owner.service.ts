import { Request } from "express";
import Restaurants from "../restaurants/restaurant.model.js";
import mongoose from "mongoose";
import { toRestaurantResponseDto } from "./owner.dto.js";

export const ownerDashboardData = async (req: Request) => {
  try {
    const user = req.user;

    const restaurantsOwned = await Restaurants.find({
      owner_id: new mongoose.Types.ObjectId(user?.id),
    });

    return restaurantsOwned.map(toRestaurantResponseDto);
  } catch (error: unknown) {
    throw error;
  }
};

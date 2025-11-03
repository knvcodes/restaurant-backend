import express from "express";
import {
  restaurantDetails,
  restaurantsListing,
} from "./modules/restaurants/restaurant.controller";

const router = express.Router();

router.get("/restaurants/list", restaurantsListing);
router.get("/restaurants/:id", restaurantDetails);

export default router;

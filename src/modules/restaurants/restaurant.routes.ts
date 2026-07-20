import express from "express";
import {
  restaurantDetails,
  restaurantsListing,
} from "./restaurant.controller.js";
import {
  restaurantDetailsSchema,
  restaurantListingSchema,
} from "./restaurant.validate.js";
import { validate } from "../../middlewares/validation.js";

const restaurantRouter = express.Router();

restaurantRouter.get(
  "/list",
  validate(restaurantListingSchema),
  restaurantsListing,
);
restaurantRouter.get(
  "/:id",
  validate(restaurantDetailsSchema),
  restaurantDetails,
);

export default restaurantRouter;

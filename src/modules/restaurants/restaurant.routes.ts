import express from "express";
import {
  restaurantDetails,
  restaurantsListing,
} from "./restaurant.controller.js";
import { restaurantDetailsSchema } from "./restaurant.validate.js";
import { validate } from "../../middlewares/validation.js";

const restaurantRouter = express.Router();

restaurantRouter.get("/list", restaurantsListing);
restaurantRouter.get(
  "/:id",
  validate(restaurantDetailsSchema),
  restaurantDetails,
);

export default restaurantRouter;

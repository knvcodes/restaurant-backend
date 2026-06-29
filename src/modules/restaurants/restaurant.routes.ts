import express from "express";
import { restaurantDetails, restaurantsListing } from "./restaurant.controller";
import { ADMIN_ROLE, ALL_ROLES } from "config/roles";
import { validate } from "middlewares/validation";
import { restaurantDetailsSchema } from "./restaurant.validate";

const restaurantRouter = express.Router();

restaurantRouter.get("/list", restaurantsListing);
restaurantRouter.get(
  "/:id",
  validate(restaurantDetailsSchema),
  restaurantDetails,
);

export default restaurantRouter;

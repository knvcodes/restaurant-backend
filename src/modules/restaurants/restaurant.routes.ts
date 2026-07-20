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
import { auth } from "../../middlewares/auth.middleware.js";
import { OWNER_ROLE } from "../../config/roles.js";

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

// owner routes
restaurantRouter.get("/", auth(OWNER_ROLE), restaurantsListing);

export default restaurantRouter;

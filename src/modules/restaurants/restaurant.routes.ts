import express from "express";
import { restaurantDetails, restaurantsListing } from "./restaurant.controller";
import { ADMIN_ROLE, ALL_ROLES } from "config/roles";

const restaurantRouter = express.Router();

restaurantRouter.get("/list", restaurantsListing);
restaurantRouter.get("/:id", restaurantDetails);

export default restaurantRouter;

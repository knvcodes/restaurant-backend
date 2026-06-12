import express from "express";
import { restaurantDetails, restaurantsListing } from "./restaurant.controller";
import { auth } from "middlewares/auth.middleware";
import { ADMIN_ROLE, ALL_ROLES } from "config/roles";

const restaurantRouter = express.Router();

restaurantRouter.get("/list", auth(ADMIN_ROLE), restaurantsListing);
restaurantRouter.get("/:id", restaurantDetails);

export default restaurantRouter;

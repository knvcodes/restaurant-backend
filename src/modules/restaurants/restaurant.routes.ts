import express from "express";
import { restaurantDetails, restaurantsListing } from "./restaurant.controller";

const restaurantRouter = express.Router();

restaurantRouter.get("/list", restaurantsListing);
restaurantRouter.get("/:id", restaurantDetails);

export default restaurantRouter;

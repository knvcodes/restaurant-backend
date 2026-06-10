import express from "express";
import { addDish, dishesListing } from "./dishes.controller";
import { validate } from "middlewares/validation";
import { addDishSchema, dishesListingSchema } from "./dishes.validate";

const dishesRouter = express.Router();

dishesRouter.get("/list", validate(dishesListingSchema), dishesListing);
dishesRouter.post("/add", validate(addDishSchema), addDish);

export default dishesRouter;

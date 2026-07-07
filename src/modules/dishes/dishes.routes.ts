import express from "express";
import { validate } from "../../middlewares/validation.js";
import { addDishSchema, dishesListingSchema } from "./dishes.validate.js";
import { addDish, dishesListing } from "./dishes.service.js";

const dishesRouter = express.Router();

dishesRouter.get("/list", validate(dishesListingSchema), dishesListing);
dishesRouter.post("/add", validate(addDishSchema), addDish);

export default dishesRouter;

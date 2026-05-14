import express from "express";
import { addDish, dishesListing } from "./dishes.controller";

const dishesRouter = express.Router();

dishesRouter.get("/list", dishesListing);
dishesRouter.post("/add", addDish);

export default dishesRouter;

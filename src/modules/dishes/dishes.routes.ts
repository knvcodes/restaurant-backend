import express from "express";
import { dishessListing } from "./dishes.controller";

const dishesRouter = express.Router();

dishesRouter.get("/list", dishessListing);

export default dishesRouter;
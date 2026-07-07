import express from "express";
import { supplementssListing } from "./supplements.controller.js";

const supplementsRouter = express.Router();

supplementsRouter.get("/list", supplementssListing);

export default supplementsRouter;

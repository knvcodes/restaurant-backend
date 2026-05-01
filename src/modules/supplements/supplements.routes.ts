import express from "express";
import { supplementssListing } from "./supplements.controller";

const supplementsRouter = express.Router();

supplementsRouter.get("/list", supplementssListing);

export default supplementsRouter;
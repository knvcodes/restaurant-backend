import express from "express";
import { userssListing } from "./users.controller";

const usersRouter = express.Router();

usersRouter.get("/list", userssListing);

export default usersRouter;
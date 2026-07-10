import express from "express";
import { updateAvatar, userProfile } from "./users.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { ALL_ROLES } from "../../config/roles.js";

const usersRouter = express.Router();

usersRouter.put("/avatar", auth(ALL_ROLES), updateAvatar);
usersRouter.get("/profile", auth(ALL_ROLES), userProfile);

export default usersRouter;

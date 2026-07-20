import express from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { OWNER_ROLE } from "../../config/roles.js";
import { ownerDashboard } from "./owner.controller.js";

const ownerRouter = express.Router();

// ownerRouter.post("/register", validate(ownerRegisterSchema), ownerRegister);
// ownerRouter.post("/login", validate(ownerLoginSchema), ownerLogin);
// ownerRouter.post("/forgotPassword", ownerRegister);
// ownerRouter.post("/changePassword", ownerRegister);
// ownerRouter.post("/resetPassword", ownerRegister);

ownerRouter.get("/dashboard", auth(OWNER_ROLE), ownerDashboard);

export default ownerRouter;

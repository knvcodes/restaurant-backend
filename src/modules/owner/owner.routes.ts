import express from "express";
import { ownerLogin, ownerRegister } from "./owner.controller";
import { validate } from "middlewares/validation";
import { ownerLoginSchema, ownerRegisterSchema } from "./owner.validate";

const ownerRouter = express.Router();

ownerRouter.post("/register", validate(ownerRegisterSchema), ownerRegister);
ownerRouter.post("/login", validate(ownerLoginSchema), ownerLogin);
ownerRouter.post("/forgotPassword", ownerRegister);
ownerRouter.post("/changePassword", ownerRegister);
ownerRouter.post("/resetPassword", ownerRegister);

export default ownerRouter;

import express from "express";
import { validate } from "middlewares/validation";
import { authLogin, authRegister } from "./auth.controller";
import { authLoginSchema, authRegisterSchema } from "./auth.validate";

const authRouter = express.Router();

authRouter.post("/register", validate(authRegisterSchema), authRegister);
authRouter.post("/login", validate(authLoginSchema), authLogin);
// authRouter.post("/forgotPassword", authRegister);
// authRouter.post("/changePassword", authRegister);
// authRouter.post("/resetPassword", authRegister);

// google ouath
authRouter.post("/register/oauth", validate(authRegisterSchema), authRegister);

export default authRouter;

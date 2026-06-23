import express from "express";
import { validate } from "middlewares/validation";
import { authLogin, authRegister, oauthRegister } from "./auth.controller";
import { authLoginSchema, authRegisterSchema } from "./auth.validate";
import { auth } from "middlewares/auth.middleware";
import { ALL_ROLES } from "config/roles";

const authRouter = express.Router();

authRouter.post("/register", validate(authRegisterSchema), authRegister);
authRouter.post("/login", validate(authLoginSchema), authLogin);
// authRouter.post("/forgotPassword", authRegister);
// authRouter.post("/changePassword", authRegister);
// authRouter.post("/resetPassword", authRegister);

// google ouath
authRouter.post("/oauth", oauthRegister);

export default authRouter;

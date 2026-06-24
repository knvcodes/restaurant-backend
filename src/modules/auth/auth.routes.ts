import express from "express";
import { validate } from "middlewares/validation";
import {
  authForgotPassword,
  authLogin,
  authRegister,
  authResetPassword,
  oauthRegister,
} from "./auth.controller";
import {
  authForgotPasswordSchema,
  authLoginSchema,
  authRegisterSchema,
  authResetPasswordSchema,
} from "./auth.validate";

const authRouter = express.Router();

authRouter.post("/register", validate(authRegisterSchema), authRegister);
authRouter.post("/login", validate(authLoginSchema), authLogin);

authRouter.post(
  "/forgotPassword",
  validate(authForgotPasswordSchema),
  authForgotPassword,
);
authRouter.post(
  "/resetPassword",
  validate(authResetPasswordSchema),
  authResetPassword,
);
// authRouter.post("/changePassword", authRegister);

// google ouath
authRouter.post("/oauth", oauthRegister);

export default authRouter;

import { Request, Response } from "express";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../utils/errors.js";
import { message } from "../../utils/messages.js";
import {
  generateRandomToken,
  getAvatarUrl,
  isEmpty,
  passwordMatch,
} from "../../utils/helpers.js";
import { generateJWT } from "../../services/jwt.service.js";
import Users from "../../modules/users/users.model.js";
import { verifyGoogleToken } from "../../config/google.js";
import {
  isResetPasswordTokenValid,
  saveForgetPasswordToken,
} from "../../services/redis.service.js";
import { sendEmail } from "../../services/email.service.js";
import { welcomeStyles } from "../../templates/welcome.styles.js";
import { generateEmailTemplate } from "../../services/template.service.js";
import StorageService from "../../services/storage.service.js";

export const register = async (req: Request) => {
  try {
    const { name, password, email, role, isOAuth } = req.body;

    const emailAlreadyUsed = await Users.findOne({
      email,
    });

    if (emailAlreadyUsed) {
      throw new ConflictError(message.failed.user.emailAlreadtExists);
    }

    await Users.create({
      name,
      password,
      email,
      role,
      isOAuth,
    });

    // send email for joining
    const template = await generateEmailTemplate(
      "welcome",
      {
        name,
        message: message.email.registerDetails,
        buttonText: message.email.register,
        link: process.env.FRONTEND_URL || "http://localhost:3001",
      },
      welcomeStyles,
    );
    await sendEmail({
      subject: "Welcome",
      to: email,
      text: "Welcome bud",
      html: template,
    });
  } catch (error: unknown) {
    throw error;
  }
};

export const login = async (req: Request, _res: Response) => {
  try {
    const { password, email } = req.body;

    const findUser = await Users.findOne({
      email,
    }).select("name password role avatar");

    // user not found
    if (!findUser) {
      throw new NotFoundError(message.failed.user.notFound);
    }

    // check passowrd
    const isPasswordMatch = await passwordMatch(password, findUser.password);

    // send tokens
    if (isPasswordMatch) {
      const tokens = generateJWT({
        id: findUser.id,
        name: findUser.name,
        role: findUser.role,
      });

      console.info("findUser:===>", findUser);
      const storageService = req.app.locals.storageService as StorageService;
      const signedUrl = await getAvatarUrl(
        storageService,
        findUser.avatar || "",
      );

      const userPayload = {
        name: findUser.name,
        role: findUser.role,
        avatar: signedUrl || "",
      };

      return { tokens, userPayload };
    } else {
      throw new UnauthorizedError(message.failed.user.incorrectPassword);
    }
  } catch (error: unknown) {
    throw error;
  }
};

export const oauthLogin = async (req: Request) => {
  try {
    const { credential } = req.body;

    if (isEmpty(credential)) {
      throw new UnauthorizedError();
    }
    // 1. Verify Google ID token
    const payload = await verifyGoogleToken(credential);

    // invalid token throw error
    if (!payload) throw new UnauthorizedError("Invalid Token");

    console.info("payload:===>", payload);

    // 2. Extract user info
    const { sub: googleId, email, name, picture } = payload;

    // 3. Find or create user in database
    const existingUser = await Users.findOne({
      email,
    });

    let user = null;
    if (!existingUser) {
      user = await Users.create({
        email,
        isOAuth: true,
        name,
        role: "customer",
        googleId,
        avatar: picture,
      });
    } else {
      user = await Users.findOneAndUpdate(
        { email },
        {
          $setOnInsert: { name, role: "customer" },
          $set: { googleId, avatar: picture, isOAuth: true },
        },
        { upsert: true, new: true }, // create if missing, return updated doc
      );
    }

    // 4. Generate JWTs
    if (user) {
      const tokens = generateJWT({
        name: user.name,
        role: user.role,
      });

      const userPayload = {
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      };

      return { tokens, userPayload };
    } else {
      throw new NotFoundError("User not found");
    }

    // 5. Store refresh token hash in DB (for revocation)

    // 6. Set HTTP-only cookies
  } catch (error: unknown) {
    throw error;
  }
};

export const forgotPassword = async (req: Request) => {
  try {
    const { email } = req.body;
    // find user by email
    const findUser = await Users.findOne({
      email,
    });

    // if user not found throw notfound error
    if (!findUser) {
      throw new NotFoundError(message.failed.user.notFound);
    }

    // if user found create token and save them in redis after deleting existing tokens
    const randomToken = generateRandomToken();
    await saveForgetPasswordToken(randomToken, findUser.id);

    // email the link with token
    const template = await generateEmailTemplate(
      "forgotpassword",
      {
        message: "Click below to reset your password",
        title: "Reset Passoword",
        link: `${process.env.FRONTEND_URL}/resetPassword/${randomToken}`,
        buttonText: "Reset Password",
      },
      welcomeStyles,
    );

    await sendEmail({
      to: findUser.email,
      subject: "Restaurant management - Forgot password",
      text: `Click the link to reset your password - ${process.env.FRONTEND_URL}/resetPassword/${randomToken}`,
      html: template,
    });
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (req: Request) => {
  try {
    const { token, newPassword } = req.body;

    // validate token
    const userId = await isResetPasswordTokenValid(token);

    // if invalid throw Unauth error
    if (!userId) {
      throw new UnauthorizedError(
        message.failed.user.resetPasswordTokenExpired,
      );
    }

    // find user
    const foundUser = await Users.findById(userId);

    // if user not found
    if (!foundUser) {
      throw new NotFoundError(message.failed.user.notFound);
    }

    // if user found update new passwords
    foundUser.password = newPassword;
    await foundUser.save();

    return;
  } catch (error) {
    throw error;
  }
};

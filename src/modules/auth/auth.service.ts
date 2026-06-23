import { Request, Response } from "express";
import { ConflictError, NotFoundError, UnauthorizedError } from "utils/errors";
import { message } from "utils/messages";
import { isEmpty, passwordMatch } from "utils/helpers";
import { generateJWT, setTokenCookies } from "services/jwt.service";
import Users from "modules/users/users.model";
import { verifyGoogleToken } from "config/google";

export const register = async (req: Request) => {
  try {
    const { name, password, email, role } = req.body;

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
    });
  } catch (error: unknown) {
    throw error;
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body;

    const findUser = await Users.findOne({
      email,
    }).select("name password role");

    // user not found
    if (!findUser) {
      throw new NotFoundError(message.failed.user.notFound);
    }

    // check passowrd
    const isPasswordMatch = await passwordMatch(password, findUser.password);

    // send tokens
    if (isPasswordMatch) {
      const tokens = generateJWT({
        name: findUser.name,
        role: findUser.role,
      });

      const userPayload = {
        name: findUser.name,
        role: findUser.role,
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

import { Request, Response } from "express";
import { ConflictError, NotFoundError, UnauthorizedError } from "utils/errors";
import { message } from "utils/messages";
import { passwordMatch } from "utils/helpers";
import { generateJWT, setTokenCookies } from "services/jwt.service";
import Users from "modules/users/users.model";

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

      return tokens;
    } else {
      throw new UnauthorizedError(message.failed.user.incorrectPassword);
    }
  } catch (error: unknown) {
    throw error;
  }
};

import { Request } from "express";
import Owner from "./owner.model";
import { NotFoundError, UnauthorizedError } from "utils/errors";
import { message } from "utils/messages";
import { passwordMatch } from "utils/helpers";
import { generateJWT } from "services/jwt.service";
import { OWNER_ROLE } from "config/roles";

export const registerOwner = async (req: Request) => {
  try {
    const { name, password, email } = req.body;
    await Owner.create({
      name,
      password,
      email,
    });
  } catch (error: unknown) {
    throw error;
  }
};

export const loginOwner = async (req: Request) => {
  try {
    const { password, email } = req.body;

    const findOwner = await Owner.findOne({
      email,
    }).select("name password");

    // user not found
    if (!findOwner) {
      throw new NotFoundError(message.failed.owner.notFound);
    }

    // check passowrd
    const isPasswordMatch = await passwordMatch(password, findOwner.password);

    // send tokens
    if (isPasswordMatch) {
      const tokens = generateJWT({
        name: findOwner.name,
        role: OWNER_ROLE,
      });
      return tokens;
    } else {
      throw new UnauthorizedError(message.failed.owner.incorrectPassword);
    }
  } catch (error: unknown) {
    throw error;
  }
};

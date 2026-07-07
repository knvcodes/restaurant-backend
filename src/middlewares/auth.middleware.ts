import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest, TokenPayload } from "../utils/types.js";
import { includesRole, isEmpty } from "../utils/helpers.js";
import { UnauthorizedError } from "../utils/errors.js";

const auth =
  (roles: string[]) =>
  (req: CustomRequest, _res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;

    console.info("cookie:===>", accessToken);

    if (isEmpty(accessToken)) {
      throw new UnauthorizedError();
    }

    if (accessToken) {
      const decoded = jwt.verify(
        accessToken,
        process.env.JWT_SECRET as string,
      ) as TokenPayload;

      // if allowed roles
      if (includesRole(decoded.role, roles)) {
        req.user = {
          id: decoded.id,
        };
        next();
      } else {
        throw new UnauthorizedError();
      }
    }
  };

export { auth };

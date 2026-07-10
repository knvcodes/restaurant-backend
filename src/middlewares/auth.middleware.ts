import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../utils/types.js";
import { includesRole, isEmpty } from "../utils/helpers.js";
import { UnauthorizedError } from "../utils/errors.js";

const auth =
  (roles: string[]) => (req: Request, _res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;

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

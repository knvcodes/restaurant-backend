import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "utils/errors";
import { includesRole, isEmpty } from "utils/helpers";
import jwt from "jsonwebtoken";

export type TokenPayload = {
  name: string;
  role: string;
};

const auth =
  (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
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

      console.info("decoded:===>", decoded);

      // if allowed roles
      if (includesRole(decoded.role, roles)) {
        next();
      } else {
        throw new UnauthorizedError();
      }
    }
  };

export { auth };

import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "utils/errors";
import { includesRole, isEmpty } from "utils/helpers";
import jwt from "jsonwebtoken";

export type TokenPayload = {
  name: string;
  role: string[];
};

const auth =
  (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (isEmpty(token)) {
      throw new UnauthorizedError();
    }

    if (token) {
      const decoded = jwt.verify(
        token,
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

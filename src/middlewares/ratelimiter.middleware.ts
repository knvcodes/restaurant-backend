import { NextFunction, Request, Response } from "express";
import { redisClient } from "../config/redis.js";
import { ForbiddenError } from "../utils/errors.js";

const RATE = "rate:";

export const rateLimit = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { email } = req.body;
  const currentCount = await redisClient.GET(RATE + email);

  if (currentCount) {
    await redisClient.SETEX(
      RATE + email,
      60,
      (Number(currentCount) + 1).toString(),
    );
  } else {
    await redisClient.SETEX(RATE + email, 60, "2");
  }

  //   throw error if limit exceeded
  if (currentCount && Number(currentCount) > 5) {
    throw new ForbiddenError("Too many request, try again later.");
  }

  next();
};

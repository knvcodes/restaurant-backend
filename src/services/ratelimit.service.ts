import { NextFunction, Request, Response } from "express";

export const rateLimiter =
  (ip: string) => (req: Request, res: Response, next: NextFunction) => {
    // if no redis entry do
    // if redis entry check if count is less than 10
    // if count is ok let it go
    // else reject user
  };

import { Response } from "express";

export const handleResponse = (res: Response, msg: string, data: unknown) => {
  res.json({
    message:msg,
    data
  })
};
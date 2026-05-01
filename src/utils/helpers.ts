import { Response } from "express";
import { restaurantDescriptions } from "./staticData";

export const handleResponse = (res: Response, msg: string, data: unknown) => {
  res.json({
    message: msg,
    data,
  });
};

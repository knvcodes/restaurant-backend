import { Response } from "express";
import logger from "./logger";
import { withLocation } from "./loggerHelper";
import bcrypt from "bcryptjs";

export const handleResponse = (res: Response, msg: string, data?: unknown) => {
  res.json({
    message: msg,
    data: data || null,
  });
};

export const isEmpty = (value: unknown): boolean => {
  try {
    if (value === undefined || value === null) {
      return true;
    }

    if (typeof value === "string") {
      return value.trim().length === 0;
    }

    if (Array.isArray(value)) {
      return value.length === 0;
    }

    if (typeof value === "object") {
      return Object.keys(value).length === 0;
    }

    return false;
  } catch {
    return true;
  }
};

export const errorLogger = (arg: unknown) => {
  logger.error(withLocation(`${arg}====>`, arg));
};

export const passwordMatch = async (password: string, hash: string) => {
  const isMatch = await bcrypt.compare(password, hash);

  if (isMatch) {
    return true;
  } else {
    return false;
  }
};

export const includesRole = (roleArray: string[], toCheckInArray: string[]) => {
  if (roleArray.every((role) => toCheckInArray.includes(role))) {
    return true;
  } else {
    return false;
  }
};

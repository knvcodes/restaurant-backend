import jwt from "jsonwebtoken";
import { Response } from "express"; // or your framework's Response type

export const generateJWT = (
  payload: Record<string, string | number | string[]>,
) => {
  if (process.env.JWT_SECRET) {
    const accessToken = jwt.sign({ ...payload }, process.env.JWT_SECRET, {
      expiresIn: (process.env.JWT_EXPIRE_ACCESS_TOKEN ||
        "15m") as jwt.SignOptions["expiresIn"],
    });
    const refreshToken = jwt.sign({ ...payload }, process.env.JWT_SECRET, {
      expiresIn: (process.env.JWT_EXPIRE_REFRESH_TOKEN ||
        "7d") as jwt.SignOptions["expiresIn"],
    });

    return {
      accessToken,
      refreshToken,
    };
  } else {
    throw new Error("No secret found");
  }
};

const COOKIE_OPTIONS = {
  access: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? ("strict" as const)
        : ("lax" as const), // ← Changed from "strict"
    maxAge: Number(process.env.COOKIE_ACCESS_TOKEN_MAX_AGE) || 900000,
  },
  refresh: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? ("strict" as const)
        : ("lax" as const), // ← Changed from "strict"
    maxAge: Number(process.env.COOKIE_REFRESH_TOKEN_MAX_AGE) || 2592000000,
    path: "/api/auth/refresh", // Only sent to refresh endpoint
  },
};

// Set cookies on the response
export const setTokenCookies = (
  res: Response,
  tokens: { accessToken: string; refreshToken: string },
) => {
  res.cookie("accessToken", tokens.accessToken, COOKIE_OPTIONS.access);
  res.cookie("refreshToken", tokens.refreshToken, COOKIE_OPTIONS.refresh);
};

// Clear cookies on logout
export const clearTokenCookies = (res: Response) => {
  res.clearCookie("accessToken", { ...COOKIE_OPTIONS.access, maxAge: 0 });
  res.clearCookie("refreshToken", { ...COOKIE_OPTIONS.refresh, maxAge: 0 });
};

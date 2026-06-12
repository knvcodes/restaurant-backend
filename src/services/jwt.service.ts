import jwt from "jsonwebtoken";

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

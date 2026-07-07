import { redisClient } from "../config/redis.js";

const token = "TOKEN:";
const user = "USER:";

export const saveForgetPasswordToken = async (
  randomToken: string,
  userId: string,
) => {
  // remove old token and add new one
  await removeForgetPasswordToken(randomToken);

  await redisClient.SETEX(token + randomToken, 3600, userId);
  await redisClient.SETEX(user + userId, 3600, randomToken);
};

export const removeForgetPasswordToken = async (userId: string) => {
  const randomToken = await redisClient.GET(user + userId);
  await redisClient.DEL(token + randomToken);
  await redisClient.DEL(user + userId);
};

export const isResetPasswordTokenValid = async (randomToken: string) => {
  const userId = await redisClient.GET(token + randomToken);

  if (userId) {
    // if exists clear both token and user Id
    await redisClient.DEL(user + userId);
    await redisClient.DEL(token + randomToken);

    return userId;
  } else {
    return false;
  }
};

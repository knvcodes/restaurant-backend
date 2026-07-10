import StorageService from "../../services/storage.service.js";
import { NotFoundError, UnauthorizedError } from "../../utils/errors.js";
import { getAvatarUrl } from "../../utils/helpers.js";
import { message } from "../../utils/messages.js";
import { toUserProfile } from "./users.dto.js";
import Users from "./users.model.js";
import { Request } from "express";

export const updateUserAvatar = async (req: Request) => {
  try {
    const { key } = req.body;

    if (req.user) {
      const user = await Users.findOneAndUpdate(
        {
          _id: req.user.id,
        },
        {
          avatar: key,
        },
      );

      if (!user) {
        throw new NotFoundError(message.failed.user.userNotFound);
      }
    }

    return true;
  } catch (error: unknown) {
    throw error;
  }
};

export const getUserProfile = async (req: Request) => {
  try {
    const storageService = req.app.locals.storageService as StorageService;

    if (req.user) {
      const user = await Users.findOne({
        _id: req.user.id,
      });

      if (!user) {
        throw new NotFoundError(message.failed.user.userNotFound);
      } else {
        const signedUrl = await getAvatarUrl(storageService, user.avatar || "");

        return toUserProfile({
          ...user.toObject(),
          avatar: signedUrl || "",
        });
      }
    } else {
      throw new UnauthorizedError();
    }
  } catch (error: unknown) {
    throw error;
  }
};

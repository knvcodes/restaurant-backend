import { Users } from "../../utils/types.js";

export const toUserProfile = (user: Users) => ({
  name: user.name,
  email: user.email,
  avatar: user.avatar,
});

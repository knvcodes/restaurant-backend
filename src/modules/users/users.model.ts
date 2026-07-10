import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { ADMIN, CUSTOMER, OWNER } from "../../config/vars.js";
import { Users } from "../../utils/types.js";

// Schema
const UsersSchema: Schema<Users> = new Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: [ADMIN, OWNER, CUSTOMER],
    },

    googleId: { type: String, unique: true, sparse: true },
    avatar: { type: String },
    isOAuth: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  },
);

UsersSchema.pre("save", async function (next) {
  // Don't hash again if password wasn't changed
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Model
const Users: Model<Users> = mongoose.model<Users>("Users", UsersSchema);

export default Users;

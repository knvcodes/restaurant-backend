import mongoose, { Schema, Document, Model, Types } from "mongoose";
import bcrypt from "bcryptjs";
import { ADMIN, CUSTOMER, OWNER } from "../../config/vars.ts";

// Interface
export interface IUsers extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar?: string;
  isOAuth: boolean;
  googleId?: string;
}

// Schema
const UsersSchema: Schema<IUsers> = new Schema(
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
      required: true,
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
const Users: Model<IUsers> = mongoose.model<IUsers>("Users", UsersSchema);

export default Users;

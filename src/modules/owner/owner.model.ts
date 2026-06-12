import mongoose, { Schema, Document, Model, Types } from "mongoose";
import bcrypt from "bcryptjs";

// Interface
export interface IOwner extends Document {
  name: string;
  email: string;
  password: string;
}

// Schema
const OwnerSchema: Schema<IOwner> = new Schema(
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
      unique: true,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

OwnerSchema.pre("save", async function (next) {
  // Don't hash again if password wasn't changed
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Model
const Owner: Model<IOwner> = mongoose.model<IOwner>("Owner", OwnerSchema);

export default Owner;

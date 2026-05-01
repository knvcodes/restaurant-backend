import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface
export interface IDishes extends Document {
  name: string;
  description?: string;
  age?: number;
  isActive: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
  profile: Record<string, unknown>;
  items: Record<string, unknown>[];
  userId?: Types.ObjectId; // ✅ relation type
}

// Schema
const DishesSchema: Schema<IDishes> = new Schema(
  {
    name: { type: String, required: true },

    description: { type: String },

    age: { type: Number },

    isActive: { type: Boolean, default: true },

    tags: [{ type: String }],

    metadata: { type: Schema.Types.Mixed },

    // Example nested object
    profile: {
      firstName: { type: String },
      lastName: { type: String },
    },

    // Example array of objects
    items: [
      {
        title: { type: String },
        value: { type: Number },
      },
    ],

    // Example reference (relation)
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Model
const Dishes: Model<IDishes> = mongoose.model<IDishes>(
  "Dishes",
  DishesSchema
);

export default Dishes;
import mongoose, { Schema, Document, Model } from "mongoose";

// Interface
export interface IDishes extends Document {
  name: string;
  description?: string;
  isActive: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
  supplements: String[];
  serving: Record<string, unknown>[];
  restaurantId?: Schema.Types.ObjectId;
}

// Schema
const DishesSchema: Schema<IDishes> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }],
    metadata: { type: Schema.Types.Mixed },
    supplements: [
      {
        type: Schema.Types.ObjectId,
        ref: "Supplements",
        require: false,
      },
    ],
    // Example array of objects
    serving: [
      {
        type: { type: String },
        value: { type: Number },
        price: { type: Number },
        currency: { type: String },
        total: { type: Number },
      },
    ],
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurants",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Model
const Dishes: Model<IDishes> = mongoose.model<IDishes>("Dishes", DishesSchema);

export default Dishes;

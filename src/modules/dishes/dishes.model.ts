import mongoose, { Schema, Document, Model, Types } from "mongoose";

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
  restaurantId?: Types.ObjectId; // ✅ relation type
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
      },
    ],

    // Example array of objects
    serving: [
      {
        title: { type: String },
        value: { type: Number },
        price: { type: Number },
        currency: { type: String },
      },
    ],

    // Example reference (relation)
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurants",
    },
  },
  {
    timestamps: true,

    toJSON: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v; // bonus garbage removal
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

// Model
const Dishes: Model<IDishes> = mongoose.model<IDishes>("Dishes", DishesSchema);

export default Dishes;

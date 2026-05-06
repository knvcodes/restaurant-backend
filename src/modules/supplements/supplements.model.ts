import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface
export interface ISupplements extends Document {
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
  restaurantId?: Types.ObjectId; // ✅ relation type
}

// Schema
const SupplementsSchema: Schema<ISupplements> = new Schema(
  {
    name: { type: String, required: true },

    description: { type: String },

    price: { type: Number },

    isActive: { type: Boolean, default: true },

    tags: [{ type: String }],

    metadata: { type: Schema.Types.Mixed },

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
const Supplements: Model<ISupplements> = mongoose.model<ISupplements>(
  "Supplements",
  SupplementsSchema,
);

export default Supplements;

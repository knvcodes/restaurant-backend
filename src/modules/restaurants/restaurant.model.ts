// src/models/restaurant.model.ts
import mongoose, { Schema, Document, Model, Date } from "mongoose";

// 1. TypeScript interfaces
interface IGrade {
  date: Date;
  grade: string;
  score: number;
}

export interface IAddress {
  building: string;
  coord: [number, number]; // [longitude, latitude]
  street: string;
  zipcode: string;
}

export interface IDeliveryHours {
  from: Date;
  to: Date;
}

interface IOpenDays {
  from: String;
  to: String;
}

export interface IRestaurant extends Document {
  restaurant_id: string;
  name: string;
  borough: string;
  cuisine: string;
  address: IAddress;
  grades: IGrade[];
  createdAt?: Date;
  updatedAt?: Date;
  discription?: string;
  deliveryHours: IDeliveryHours;
  openDays: IOpenDays;

  deliveryFee?: {
    amount: number;
    currency: string;
  };

  cancellationFee?: {
    amount: number;
    currency: string;
  };

  minimumDelivery?: {
    amount: number;
    currency: string;
  };
}

// 2. Schema definitions
const GradeSchema: Schema<IGrade> = new Schema(
  {
    date: { type: Date, required: true },
    grade: { type: String, required: true },
    score: { type: Number, required: true },
  },
  { _id: false }, // prevent Mongoose from creating _id for subdocuments
);

const AddressSchema: Schema<IAddress> = new Schema(
  {
    building: { type: String, required: true },
    coord: { type: [Number], required: true }, // [lng, lat]
    street: { type: String, required: true },
    zipcode: { type: String, required: true },
  },
  { _id: false },
);

const DeliveryHoursSchema: Schema<IDeliveryHours> = new Schema(
  {
    from: { type: Date, required: true },
    to: { type: Date, required: true },
  },
  { _id: false },
);

const OpenDaysSchema: Schema<IOpenDays> = new Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
  },
  { _id: false },
);

const RestaurantSchema: Schema<IRestaurant> = new Schema(
  {
    restaurant_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    borough: { type: String, required: true },
    cuisine: { type: String, required: true },
    address: { type: AddressSchema, required: true },
    grades: { type: [GradeSchema], default: [] },
    discription: { type: String, required: false },
    deliveryHours: { type: DeliveryHoursSchema, required: true },
    openDays: { type: OpenDaysSchema, required: true },
    deliveryFee: {
      amount: { type: Number, default: 0 },
      currency: { type: String, enum: ["INR", "USD", "EUR"], default: "USD" },
    },

    cancellationFee: {
      amount: { type: Number, default: 0 },
      currency: { type: String, enum: ["INR", "USD", "EUR"], default: "USD" },
    },

    minimumDelivery: {
      amount: { type: Number, default: 0 },
      currency: { type: String, enum: ["INR", "USD", "EUR"], default: "USD" },
    },
  },
  { timestamps: true }, // adds createdAt and updatedAt
);

// 3. Model
const Restaurants: Model<IRestaurant> = mongoose.model<IRestaurant>(
  "Restaurants",
  RestaurantSchema,
);

export default Restaurants;

import mongoose from "mongoose";
import { addDescriptionsToRestaurants } from "./migrations/add_description_restaurants";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myapp";

export const up = async () => {
  await mongoose.connect(MONGO_URI);

  const db = mongoose.connection.db;

  //   added description field
  db && addDescriptionsToRestaurants(db);

  await mongoose.disconnect();
};

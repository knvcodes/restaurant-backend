import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myapp";

export const addDescriptionsToRestaurants = async (
  db: mongoose.mongo.Db | undefined,
) => {
  // Add new field to existing docs
  db &&
    (await db
      .collection("restaurants")
      .updateMany({}, { $set: { desciption: null } }));

  await mongoose.disconnect();
};

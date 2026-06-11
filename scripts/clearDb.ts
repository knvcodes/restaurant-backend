import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myapp";

export const cleardb = async () => {
  await mongoose.connect(MONGO_URI);

  const db = mongoose.connection.db;

  db && (await db.collection("restaurants").drop());
  db && (await db.collection("dishes").drop());
  db && (await db.collection("supplements").drop());
  console.log("Database collection dropped successfully");

  await mongoose.disconnect();
};

cleardb();

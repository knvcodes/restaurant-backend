// ── CLI Runner ───────────────────────────────────────────

import dotenv from "dotenv";
import mongoose from "mongoose";
import { seedRestaurants } from "./restaurant.seeder.js";
import { seedDishes } from "./dishes.seeder.js";
import { seedUsers } from "./users.seeder.js";
dotenv.config(); // loads .env file

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/restaurant_db";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("🔌 Connected to MongoDB");
    await seedRestaurants(50);
    await seedDishes(50);
    await seedUsers();
    await mongoose.disconnect();
    console.log("👋 Disconnected");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection failed:", err);
    process.exit(1);
  });

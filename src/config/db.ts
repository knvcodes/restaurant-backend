import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected!");

    // Auto sync indexes (important)
    await mongoose.connection.syncIndexes();
    console.log("🔄 Indexes synced");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Stop the server if DB fails
  }
};

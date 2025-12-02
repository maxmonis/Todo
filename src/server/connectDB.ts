import mongoose from "mongoose";

export async function connectDB() {
  if (import.meta.env.MODE === "test") {
    return;
  }

  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

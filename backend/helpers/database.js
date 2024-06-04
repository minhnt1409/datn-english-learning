import mongoose from "mongoose";
import { MONGODB_URI } from "./config-env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error message: " + error.message);
    }
  }
}

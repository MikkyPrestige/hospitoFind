import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

// Connect to the database
const connectDB = asyncHandler(async () => {
  await mongoose.connect(process.env.MongoDB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
});

export default connectDB;
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
// import connectDB from "./database/db.js";
import cors from "cors";
import hospitalRouter from "./routes/hospitals.js";

dotenv.config();

const app = express();

// Init Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/hospitals", hospitalRouter);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.VITE_dbURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
  }
};

const start = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error(err.message);
  }
};

start();

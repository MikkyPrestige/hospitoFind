import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Hospital from "../models/hospitalsModel.js";
// import fs from "fs";

// Populate database with hospitals
// const populateDB = asyncHandler(async () => {
//   // Read the JSON file
//   const hospitals = JSON.parse(fs.readFileSync("data/hospitals.json", "utf-8"));
//   console.log("Data read from the json file");

//   // Delete existing hospitals collection in the database
//   await Hospital.deleteMany();
//   console.log(`${hospitals.length} hospitals deleted`);

//   // Insert new hospitals data into the database
//   await Hospital.insertMany(hospitals);
//   console.log(`${hospitals.length} hospitals inserted`);
//   process.exit();
// });

// Connect to the database
const connectDB = asyncHandler(async () => {
  await mongoose.connect(process.env.MongoDB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  // Populate the database with data from the json file
  // populateDB();
  // console.log("database populated");
});

export default connectDB;
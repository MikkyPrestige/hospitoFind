import dotenv from "dotenv";
import express from "express";
import connectDB from "./database/db.js";
import cors from "cors";
// import fs from "fs";
// import fetch from "node-fetch";
// import chokidar from "chokidar";
import hospitalRouter from "./routes/hospitals.js";
// import Hospital from "./models/hospitals.js";

dotenv.config();

const app = express();

// Init Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/hospitals", hospitalRouter);

// Populate database with data from json
// const populateDatabase = async () => {
//   try {
//     const jsonData = fs.readFileSync("./data/hospitals.json", "utf8");
//     const hospitals = JSON.parse(jsonData);
//     console.log("Data read from the json file");

// Clear the existing hospitals collection in the database
// await Hospital.deleteMany();

// Insert the hospitals data into the database
//     await Hospital.insertMany(hospitals);
//     console.log("Data populated into the database");
//     // });
//   } catch (err) {
//     console.error(err.message);
//   }
// };

// Watch for changes in the json file
// const watcher = chokidar.watch("./data/hospitals.json");

// watcher.on("change", () => {
//   console.log("JSON file changed, updating database...");
//   populateDatabase();
// });

// Connect Database
// await connectDB();
// connectDB().then(() => {
//   // Populate data into the database on server startup
//   populateDatabase().then(() => {
//     app.listen(process.env.PORT, () => {
//       console.log(`Server started on port ${process.env.PORT}`);
//     });
//   });
// });

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

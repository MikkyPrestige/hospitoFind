import dotenv from "dotenv";
import express from "express";
import connectDB from "./database/db.js";
import cors from "cors";
import fs from "fs";
import fetch from "node-fetch";
import hospitalRouter from "./routes/hospitals.js";

dotenv.config();

const app = express();

// Init Middleware
app.use(cors());
app.use(express.json());

// Body Parser
// app.use(express.urlencoded({ extended: true }));

// Connect Database
await connectDB();

// Routes
app.use("/api/hospitals", hospitalRouter);

const PORT = process.env.PORT;

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Populate database with data from hospitalData.json
const jsonData = fs.readFileSync("./data/hospitals.json", "utf8");
const hospitals = JSON.parse(jsonData);

const url = "http://localhost:5000/api/hospitals";

hospitals.forEach(async (hospital) => {
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hospital),
    });

    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err.message);
  }
});

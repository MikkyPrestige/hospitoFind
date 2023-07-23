import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import connectDB from "./config/db.js";
import { logger, logEvents } from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";
import rootRouter from "./routes/rootRoute.js";
import hospitalRouter from "./routes/hospitalsRoute.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

dotenv.config();

// Connect to database
connectDB();

// Init Middleware
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use("/", express.static("public"))
app.use("/", express.static("public/views"));

// Routes
app.use("/", rootRouter)
app.use("/hospitals", hospitalRouter);

// 404
app.all("*", (req, res) => {
  res.status(404)
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "public", "views", "404.html"))
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" })
  } else {
    res.type("txt").send("404 Not Found")
  }
})

app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000;

mongoose.connection.once("open", () => {
  console.log("MongoDB Connected!");
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
});
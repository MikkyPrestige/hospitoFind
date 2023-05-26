import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.VITE_dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;

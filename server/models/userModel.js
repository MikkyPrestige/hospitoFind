import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  auth0UserId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: false,
    minLength: 3,
    maxLength: 255
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 255
  },
  // ProfileDp: {
  //   Data: Buffer,
  //   ContentType: String
  // }
  password: {
    type: String,
    required: true,
    unique: false,
    minLength: 6,
    maxLength: 1024
  }
}, { timestamps: true });

const User = mongoose.model("user", userSchema);

export default User;

import Jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }
    // Verify token
    const decoded = Jwt.verify(token, process.env.jwtSecret);
    // Add user from payload
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

import express from "express";
import { register, login } from "../controllers/userController.js";
// import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// @route   POST api/users/register
// @desc    Register new user
// @access  Public
router.post("/register", register);

// @route   POST api/users/login
// @desc    Login user
// @access  Public
router.post("/login", login);

// @route   GET api/users
// @desc    Get user data
// @access  Private
// router.get("/", authenticate, (req, res) => {
//   res.json(req.user);
//   res.status(200).json({ message: "Protected route accessed successfully" });
// });

export default router;

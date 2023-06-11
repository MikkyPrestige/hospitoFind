import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body
  // confirm data
  if (!username) {
    return res.status(400).json({ message: "Please fill in username" })
  } else if (!password) {
    return res.status(400).json({ message: "Please fill in password" })
  }

  const user = await User.findOne({ username }).exec()
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  const accessToken = jwt.sign({ "username": user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" })
  const refreshToken = jwt.sign({ "username": user.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })

  res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "none", secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 })

  res.json({ accessToken })
})

// @desc Refresh token
// @route GET /auth/refresh
// @access Public
const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies

  if (!cookies?.jwt) return res.status(401).json({ message: "No refresh token" })

  const refreshToken = cookies.jwt

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "forbidden" })
    }

    const user = await User.findOne({ username: decoded.username }).exec()
    if (!user) {
      return res.status(404).json({ message: "unauthorized" })
    }

    const accessToken = jwt.sign({ "username": user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
    res.json({ accessToken })
  })
})

// @desc Logout
// @route POST /auth/logout
// @access Private
const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.status(204)

  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true }).json({ message: 'Cookie cleared' })
})

export default {
  login,
  refresh,
  logout
}
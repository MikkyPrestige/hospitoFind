import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

// @desc Auth0
// @route POST /auth
// @access Public
const auth0 = asyncHandler(async (req, res) => {
  const { auth0UserId, name, email } = req.body
  // Check if the user already exists in MongoDB
  let user = await User.findOne({ auth0UserId }).exec()
  if (!user) {
    // If not, create a new user in MongoDB
    user = await User.create({ auth0UserId, name, email })
  }
  // Return user data
  res.status(201).json({ message: 'User data stored successfully' });
  // res.json({
  //   _id: user._id,
  //   name: user.name,
  //   email: user.email,
  //   auth0UserId: user.auth0UserId
  // })
})

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

  // create tokens
  const accessToken = jwt.sign({ "username": user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" })
  const refreshToken = jwt.sign({ "username": user.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })

  res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "none", secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
  // console.log(user.name)
  // console.log(user.username)
  // console.log(user.email)
  // console.log(accessToken)
  // console.log(user.ProfileDp)

  // res.header("id", user._id).sendStatus(201);
  res.status(201).json({
    accessToken,
    name: user.name,
    username: user.username,
    email: user.email,
    // profileDp: user.ProfileDp
  })
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
  if (!cookies?.jwt) return res.sendStatus(200)

  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true }).json({ message: 'Cookie cleared' })
  res.status(201).json({ message: "Logged out" })
})

export default {
  auth0,
  login,
  refresh,
  logout
}
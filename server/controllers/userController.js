import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

// @desc    Get all users
// @route   GET /users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean()
  if (!users) return res.status(404).json({ message: "No users found" })
  res.json(users);
});

// @desc    Create new user
// @route   POST /users
// @access  Private
const createUser = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body
  if (!name || !username || !password || !email) {
    return res.status(400).json({ message: "Please fill in all fields" })
  }

  const duplicateUsername = await User.findOne({ username }).lean().exec()
  if (duplicateUsername) {
    return res.status(409).json({ message: "Username already taken" })
  }

  const duplicateEmail = await User.findOne({ email }).lean().exec()
  if (duplicateEmail) {
    return res.status(409).json({ message: "Email exists with another user" })
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // create user
  const user = await User.create({
    name,
    username,
    password: hashedPassword,
    email
  })

  res.status(201).json({ message: `${user.username} user created` })
})

// @desc    update user
// @route   PATCH /users
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body

  if (!password) {
    return res.status(400).json({ message: "Password is required" })
  }

  const user = await User.findOne({ username }).exec();
  if (!user) {
    return res.status(404).json({ message: "User not found. Use your correct username" });
  }

  // check if email is already taken by another user
  const existingEmailUser = await User.findOne({ email: { $ne: user.email }, email }).exec();
  if (existingEmailUser) {
    return res.status(409).json({ message: "Email already taken" });
  }


  // check if password is correct
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" })
  }

  // update user
  user.name = name
  user.username = username
  user.email = email

  const updatedUser = await user.save()
  res.status(201).json({ message: `${updatedUser.username} user updated` })
})

// @desc Update Password
// @route PATCH /users/password
// @access Private
const updatePassword = asyncHandler(async (req, res) => {
  const { username, password, newPassword } = req.body

  if (!username) {
    return res.status(400).json({ message: "Username is required" })
  } else if (!password) {
    return res.status(400).json({ message: "Old password is required" })
  } else if (!newPassword) {
    return res.status(400).json({ message: "New password is required" })
  }

  const user = await User.findOne({ username }).lean().exec()
  if (!user) {
    return res.status(404).json({ message: "User does not exist" })
  }

  // check if password is correct
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" })
  }

  // hash password
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  // update password
  user.password = hashedPassword
  await user.save()
  res.status(201).json({ message: `${user.username} password updated` })
})

// @desc    Delete user
// @route   DELETE /users
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body

  if (!username) {
    return res.status(400).json({ message: "Username is required" })
  } else if (!password) {
    return res.status(400).json({ message: "Password is required" })
  }

  const user = await User.findOne({ username }).exec()
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  // check if password is correct
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" })
  }

  const deletedUser = await user.deleteOne()
  res.status(201).json({ message: `${deletedUser.username} user deleted` })
})

export default {
  getUsers,
  createUser,
  updateUser,
  updatePassword,
  deleteUser,
}


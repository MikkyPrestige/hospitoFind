import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

// @desc    Get image
// @route   GET /users/image
// @access  Private
// const getImage = asyncHandler(async (req, res) => {
//   const { id } = req.params
//   const user = await User.findById({ _id: id }).select("ProfileDp").lean().exec()
//   // const user = await User.findById(id).select("ProfileDp").lean().exec();
//   if (!user) return res.status(404).json({ message: "User not found" })
//   res.set("Content-Type", user.ProfileDp.ContentType)
//   res.status(200).send(user.ProfileDp.Data);
// });

// @desc    Get all users
// @route   GET /users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean()
  if (!users) return res.status(404).json({ message: "No users found" })
  res.json(users);
});

// // @desc     get user by id
// // @route    GET /users/:id
// // @access   Private
// const getUser = asyncHandler(async (req, res) => {
//   const { username } = req.body
//   const user = await User.findOne({ username }).select("-password").lean().exec()
//   // const user = await User.findById(id).select("-password").lean().exec();
//   if (!user) return res.status(404).json({ message: "User not found" })
//   res.send(user)
// })

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

  // extract data and mimetype
  // const { data, mimetype } = req.files.file;
  // user.ProfileDp.Data = data
  // user.ProfileDp.ContentType = mimetype
  // await user.save()
  // res.header("id", user._id).sendStatus(201)
  res.status(201).json({ message: `${user.username} user created` })
})

// @desc    update user
// @route   PATCH /users
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body

  // if (!name || !username || !email) {
  //   return res.status(400).json({ message: "Enter Name or Email to update" })
  // }

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
  // extract data and mimetype
  // const { data, mimetype } = req.files.file;
  // user.ProfileDp.Data = data
  // user.ProfileDp.ContentType = mimetype

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

// @desc save hospital
// @route POST /hospitals
// @access Public
// const saveHospital = asyncHandler(async (req, res) => {
//   const userName = req.user.name
//   console.log(req.user.name)

//   const hospitalDetails = req.body.hospital
//   // const hospital = await Hospital.create(hospitalDetails)
//   User.findOneAndUpdate(
//     userName,
//     { $push: { hospitals: hospitalDetails } },
//     { new: true }
//   ).then((user) => {
//     res.status(201).json({ message: `${user.username} hospital saved` })
//   })
//     .catch((err) => {
//       res.status(400).json({ message: "Failed to save hospital details" })
//     }
//     )
// })

// @desc get saved hospital
// @route GET /hospitals
// @access Public
// const getSavedHospital = asyncHandler(async (req, res) => {
//   const userId = req.user.id

//   User.findById(userId).select("hospitals").lean().exec()
//     .then((user) => {
//       res.status(200).json(user.hospitals)
//     })
//     .catch((err) => {
//       res.status(400).json({ message: "Failed to get saved hospital details" })
//     })
// })

export default {
  // getImage,
  getUsers,
  // getUser,
  createUser,
  updateUser,
  updatePassword,
  deleteUser,
  // saveHospital,
  // getSavedHospital
}


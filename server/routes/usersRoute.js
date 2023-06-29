import express from "express";
import userController from "../controllers/userController.js";
import verify from "../middleware/verify.js";

const userRouter = express.Router();

// userRouter.route("/image/:id")
//   .get(userController.getImage)

userRouter.route("/")
  .get(userController.getUsers)
  // .get(userController.getUser)
  .post(userController.createUser)
  .patch(userController.updateUser)
  .delete(verify, userController.deleteUser)

// userRouter.route("/library")
//   .post(userController.saveHospital)
//   .get(userController.getSavedHospital)

export default userRouter;

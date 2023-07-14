import express from "express";
import userController from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route("/")
  .get(userController.getUsers)
  .post(userController.createUser)
  .patch(userController.updateUser)
  .patch(userController.updatePassword)
  .delete(userController.deleteUser)

export default userRouter;

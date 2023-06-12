import express from "express";
import userController from "../controllers/userController.js";
import verify from "../middleware/verify.js";

const userRouter = express.Router();

userRouter.route("/")
  .get(verify, userController.getUsers)
  .post(userController.createUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

export default userRouter;

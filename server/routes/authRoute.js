import express from "express";
import loginLimiter from "../middleware/loginLimiter.js";
import authController from "../controllers/authController.js";

const authRouter = express()

authRouter.route("/")
  .post(loginLimiter, authController.login)

authRouter.route("/refresh")
  .get(authController.refresh)

authRouter.route("/logout")
  .post(authController.logout)

export default authRouter;
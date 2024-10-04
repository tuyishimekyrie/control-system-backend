import express from "express";
import {
  loginController,
  requestPasswordReset,
  resetPassword,
  getUserByEmailController,
} from "../controllers";

const loginRoute = express.Router();

loginRoute.post("/auth/login", loginController);
loginRoute.get("/user/:email", getUserByEmailController);
loginRoute.post("/auth/request-password-reset", requestPasswordReset);
loginRoute.post("/auth/reset-password", resetPassword);

export default loginRoute;

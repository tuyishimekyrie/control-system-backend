import express from "express";
import {
  loginController,
  updatePasswordController,
  getUserByEmailController,
} from "../controllers";

const loginRoute = express.Router();

loginRoute.post("/auth/login", loginController);
loginRoute.patch("/auth/update-password", updatePasswordController);
loginRoute.get("/user/:email", getUserByEmailController);

export default loginRoute;

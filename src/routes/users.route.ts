import express from "express";
import {
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserByIdController,
  deleteAllUsersController,
} from "../controllers/users.controller";

const userRoute = express.Router();

userRoute.get("/users", getAllUsersController);
userRoute.get("/users/:id", getUserByIdController);
userRoute.put("/users/:id", updateUserController);
userRoute.delete("/users/:id", deleteUserByIdController);
userRoute.delete("/users", deleteAllUsersController);

export default userRoute;

import express from "express";

import {
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserByIdController,
  deleteAllUsersController,
  getUserByEmail,
} from "../controllers/users.controller";

const userRoute = express.Router();

userRoute.get("/users", getAllUsersController);
userRoute.get("/users/:id", getUserByIdController);
userRoute.get("/user/:email", getUserByEmail);
userRoute.patch("/users/:id", updateUserController);
userRoute.delete("/users/:id", deleteUserByIdController);
userRoute.delete("/users", deleteAllUsersController);

export default userRoute;

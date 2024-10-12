import express from "express";

import {
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserByIdController,
  deleteAllUsersController,
  getUserByEmail,
  changeUserDeviceName,
  getUserByEmails,
} from "../controllers/users.controller";

const userRoute = express.Router();

userRoute.get("/users", getAllUsersController);
userRoute.get("/users/:id", getUserByIdController);
userRoute.get("/user/:email", getUserByEmail);
userRoute.get("/userEmail/:email", getUserByEmails);
userRoute.patch("/users/:id", updateUserController);
userRoute.delete("/users/:id", deleteUserByIdController);
userRoute.delete("/users", deleteAllUsersController);
userRoute.patch("/username/:id", changeUserDeviceName);

export default userRoute;

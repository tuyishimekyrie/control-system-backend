import express from "express";
import { loginController } from "../controllers";

const loginRoute = express.Router();

loginRoute.post("/auth/login", loginController);

export default loginRoute;

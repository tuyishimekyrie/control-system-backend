import express from "express";
import { logoutController } from "../controllers";

const logoutRoute = express.Router();

logoutRoute.get("/auth/logout", logoutController);

export default logoutRoute;

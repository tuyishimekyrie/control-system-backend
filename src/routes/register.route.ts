import express from "express";
import { registerController } from "../controllers/register.controller";

const registerRoute = express.Router();

registerRoute.post("/auth/register", registerController);

export default registerRoute;

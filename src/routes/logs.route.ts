import express from "express";
import { logUserActivityController } from "../controllers/logs.controller";

const logsRoute = express.Router();

logsRoute.post("/user/logs", logUserActivityController);

export default logsRoute;

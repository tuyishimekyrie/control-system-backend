import express from "express";
import {
  logUserActivityController,
  getAllLogsController,
  deleteAllLogsController,
  getTotalTimeSpentPerWebsiteController,
} from "../controllers/logs.controller";

const logsRoute = express.Router();

logsRoute.post("/user/logs", logUserActivityController);
logsRoute.get("/user/logs/all", getAllLogsController);
logsRoute.get(
  "/user/logs/total-time-per-website",
  getTotalTimeSpentPerWebsiteController,
);
logsRoute.delete("/user/logs", deleteAllLogsController);

export default logsRoute;

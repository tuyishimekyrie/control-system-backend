import express from "express";
import {
  logUserActivityController,
  getAllLogsController,
  getLogByIdController,
  deleteAllLogsController,
} from "../controllers/logs.controller";

const logsRoute = express.Router();

logsRoute.post("/user/logs", logUserActivityController);
logsRoute.get("/user/logs", getAllLogsController);
logsRoute.get("/user/logs/:id", getLogByIdController);
logsRoute.delete("/user/logs", deleteAllLogsController);

export default logsRoute;

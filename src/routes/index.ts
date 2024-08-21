import express, { Router } from "express";
import http from "http";
import homeRoute from "./home.route";
import registerRoute from "./register.route";
import loginRoute from "./login.route";
import adminRoute from "./admin.route";
import logoutRoute from "./logout.route";
import logsRoute from "./logs.route";
import userRoute from "./users.route";
import categoryRoute from "./category.route";
import blockedUrlRoute from "./blockedurl.route";
import keywordRoute from "./keyword.route";
import filterDataRoute from "./filterData.route";
import blockRouter from "./blocked.route";

const app = express();

const server = http.createServer(app);

const router = Router();
const routers: Router[] = [
  homeRoute,
  registerRoute,
  loginRoute,
  adminRoute,
  logoutRoute,
  logsRoute,
  userRoute,
  categoryRoute,
  blockedUrlRoute,
  keywordRoute,
  filterDataRoute,
  blockRouter,
];

router.use("/api/v1", routers);

export default router;

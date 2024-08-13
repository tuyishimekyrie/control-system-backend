import express, { Router } from "express";
import http from "http";
import homeRoute from "./home.route";
import registerRoute from "./register.route";
import loginRoute from "./login.route";
import adminRoute from "./admin.route";
import logoutRoute from "./logout.route";
import logsRoute from "./logs.route";

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
];

router.use("/api/v1", routers);

export default router;

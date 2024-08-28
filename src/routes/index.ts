import express, { Router } from "express";
import http from "http";
import adminRoute from "./admin.route";
import blockRouter from "./blocked.route";
import blockedUrlRoute from "./blockedurl.route";
import categoryRoute from "./category.route";
import filterDataRoute from "./filterData.route";
import homeRoute from "./home.route";
import keywordRoute from "./keyword.route";
import loginRoute from "./login.route";
import logoutRoute from "./logout.route";
import logsRoute from "./logs.route";
import registerRoute from "./register.route";
import subscriptionRoute from "./subscription.route";
import userRoute from "./users.route";
import orgsRoute from "./organization.route";
import notificationsRoutes from "./notifications.route";

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
  subscriptionRoute,
  orgsRoute,
  notificationsRoutes,
];

router.use("/api/v1", routers);

export default router;

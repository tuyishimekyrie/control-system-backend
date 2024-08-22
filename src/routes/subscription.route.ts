import express from "express";
import { subscriptionContoller } from "../controllers";

const subscriptionRoute = express.Router();

subscriptionRoute.patch("/subscribe/:id", subscriptionContoller);

export default subscriptionRoute;

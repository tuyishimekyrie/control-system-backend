import express from "express";
import { homeContoller } from "../controllers";

const homeRoute = express.Router();

homeRoute.get("/", homeContoller);

export default homeRoute;

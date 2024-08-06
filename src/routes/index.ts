import express, { Router } from "express";
import http from "http";
import homeRoute from "./home.route"
import registerRoute from "./register.route";

const app = express();

const server = http.createServer(app);


const router = Router();
const routers: Router[] = [
    homeRoute,
    registerRoute
];


router.use("/api/v1", routers);

export default router;

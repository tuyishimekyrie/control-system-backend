import express, { Router } from "express";
import http from "http";
import homeRoute from "./home.route"

const app = express();

const server = http.createServer(app);


const router = Router();
const routers: Router[] = [
    homeRoute
];


router.use("/api/v1", routers);

export default router;

import { Router } from "express";
import keywordController from "../controllers/keyword.controller";

const keywordRoute = Router();

keywordRoute.get("/keyword-predefined", keywordController);

export default keywordRoute;

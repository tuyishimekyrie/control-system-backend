import { Router } from "express";
import { filterController } from "../controllers/filter.controller";

const filterDataRoute = Router();

filterDataRoute.get("/filter-url", filterController);

export default filterDataRoute;

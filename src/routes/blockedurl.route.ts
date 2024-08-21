import { Router } from "express";
import { insertBlockedURL } from "../controllers/blockedurl.controller";
import { dbObj } from "../../drizzle/db";
import { URLFilter } from "../models";

const blockedUrlRoute = Router();

blockedUrlRoute.post("/blocked-urls", insertBlockedURL);

export default blockedUrlRoute;

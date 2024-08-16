import express from "express";
import {
  authenticateMiddleware,
  authorizeMiddleware,
} from "../middleware/authenticateToken";
import { adminController } from "../controllers";

const adminRoute = express.Router();

// adminRoute.use(authenticateMiddleware); // Apply authentication middleware

adminRoute.get(
  "/admin/dashboard",
  authorizeMiddleware(["manager"]),
  adminController
); // Apply role authorization middleware

export default adminRoute;

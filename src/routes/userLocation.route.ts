import express from "express";
import userLocationController, {
  getAllLocations,
  getLocation,
} from "../controllers/userLocation.controller";

const userLocationRouter = express.Router();

userLocationRouter.post("/update-location", userLocationController);
userLocationRouter.get("/location/:userId", getLocation);
userLocationRouter.get("/locations?:organizationId", getAllLocations);

export default userLocationRouter;

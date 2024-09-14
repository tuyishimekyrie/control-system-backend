import express from "express";
import userLocationController, {
  getAllLocations,
  getAllUserLocations,
  getLocation,
} from "../controllers/userLocation.controller";

const userLocationRouter = express.Router();

userLocationRouter.post("/update-location", userLocationController);
userLocationRouter.get("/location/:userId", getLocation);
userLocationRouter.get("/locations?:organizationId", getAllLocations);
userLocationRouter.get("/location", getAllUserLocations);

export default userLocationRouter;

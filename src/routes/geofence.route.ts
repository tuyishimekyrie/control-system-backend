import express from "express";
import createGeoFence, {
  deleteGeofenceByOrganization,
  fetchGeofencesByOrganization,
} from "../controllers/geofence.controller";

const geofencerouter = express.Router();

// POST route for creating a geofence
geofencerouter.post("/geofence", createGeoFence);

// GET route for fetching geofences by organization ID
geofencerouter.get("/geofence", fetchGeofencesByOrganization);

geofencerouter.delete("/geofence",deleteGeofenceByOrganization)

export default geofencerouter;


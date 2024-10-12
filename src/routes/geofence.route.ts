import express from "express";
import createGeoFence, { fetchGeofencesByOrganization } from "../controllers/geofence.controller";

const geofencerouter = express.Router();

// POST route for creating a geofence
geofencerouter.post("/geofence", createGeoFence);

// GET route for fetching geofences by organization ID
geofencerouter.get("/geofence", fetchGeofencesByOrganization);

export default geofencerouter;

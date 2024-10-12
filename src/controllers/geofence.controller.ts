import { z } from "zod";
import { Request, Response } from "express";
import { dbObj } from "../../drizzle/db"; // Assuming you have db instance already set up
import { geofence } from "../models/geofence";
import { eq } from "drizzle-orm";

// Zod schema for geofencing data validation
const geoFenceSchema = z.object({
  latitude: z.number().min(-90).max(90), // Decimal latitude
  longitude: z.number().min(-180).max(180), // Decimal longitude
  radius: z.number().min(1), // Integer for radius in meters
  organizationId: z.string(), // Organization ID must be a string
});

// Controller to handle creating a geofence
const createGeoFence = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod
    const geofenceData = geoFenceSchema.parse(req.body);

    // Insert the geofence into MySQL using Drizzle ORM
      const result = await (await dbObj).insert(geofence).values({
        //@ts-ignore
      latitude: geofenceData.latitude, // Decimal value
      longitude: geofenceData.longitude, // Decimal value
      radius: geofenceData.radius, // Integer value
      organizationId: geofenceData.organizationId, // Organization ID
      createdAt: new Date(), // Date for createdAt
    });

    // Return success response
    res.status(201).json({ message: "Geofence created successfully", result });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
export const fetchGeofencesByOrganization = async (req: Request, res: Response) => {
  const { organizationId } = req.query;

  if (!organizationId) {
    return res.status(400).json({ error: "Organization ID is required" });
  }

  try {
    const result = await (
      await dbObj
    )
      .select()
      .from(geofence)
      .where(eq(geofence.organizationId,organizationId as string));

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No geofences found for this organization" });
    }

    res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch geofences" });
  }
};

export default createGeoFence;

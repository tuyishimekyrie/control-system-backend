import { Request, Response } from "express";
import { userLocations } from "../models/userLocation";
import { dbObj } from "../../drizzle/db";
import { eq } from "drizzle-orm";
import { users } from "../models";
import { logger } from "../utils/Logger";
let locationStore: {
  [userId: string]: { latitude: number; longitude: number };
} = {};
const userLocationController = async (req: Request, res: Response) => {
  const { userId, latitude, longitude } = req.body;

  try {
    // Check if location record exists
    const existingLocation = await (await dbObj)
      .select()
      .from(userLocations)
      .where(eq(userLocations.userId, userId))
      .limit(1);

    if (existingLocation.length > 0) {
      // Update existing record
      await (
        await dbObj
      )
        .update(userLocations)
        .set({
          latitude,
          longitude,
          recordedAt: new Date(),
        })
        .where(eq(userLocations.userId, userId));

      res.status(200).json({ message: "Location updated successfully" });
    } else {
      // Insert new record
      await (await dbObj).insert(userLocations).values({
        userId,
        latitude,
        longitude,
        recordedAt: new Date(),
      });

      res.status(201).json({ message: "Location inserted successfully" });
    }
  } catch (error) {
    console.error("Database error: ", error);
    res.status(500).json({ error: "An error occurred" });
  }
};
// GET: Fetch user location
export const getLocation = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Check if location data exists for the user
    const location = locationStore[userId];
    if (!location) {
      return res
        .status(404)
        .json({ message: "Location not found for the user." });
    }

    // Return the location data
    return res.status(200).json({
      message: "Location retrieved successfully",
      data: { userId, ...location },
    });
  } catch (error) {
    console.error("Error fetching location:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
// GET: Fetch all user locations
export const getAllLocations = async (req: Request, res: Response) => {
  try {
    // Extract and validate organizationId from query parameters
    const organizationId =
      typeof req.query.organizationId === "string"
        ? req.query.organizationId
        : "";

    if (!organizationId) {
      return res
        .status(400)
        .json({ message: "Missing or invalid organizationId" });
    }

    // Query the database to get all locations with user names for the specified organization
    const locations = await (
      await dbObj
    )
      .select({
        id: userLocations.id,
        userId: userLocations.userId,
        latitude: userLocations.latitude,
        longitude: userLocations.longitude,
        recordedAt: userLocations.recordedAt,
        userName: users.name, // Assuming the name field is in the users table
      })
      .from(userLocations)
      .innerJoin(users, eq(userLocations.userId, users.id)) // Join with users table
      .where(eq(users.organizationId, organizationId)) // Correct usage of eq within where
      .execute();

    return res.status(200).json({
      message: "All locations retrieved successfully",
      data: locations,
    });
  } catch (error) {
    console.error("Error fetching all locations:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getAllUserLocations = async (req: Request, res: Response) => {
  try {
    const data = await (
      await dbObj
    )
      .select({
        id: userLocations.id,
        userId: userLocations.userId,
        latitude: userLocations.latitude,
        longitude: userLocations.longitude,
        recordedAt: userLocations.recordedAt,
        userName: users.name,
      })
      .from(userLocations)
      .innerJoin(users, eq(userLocations.userId, users.id)) // Join with users table
      .where(eq(users.id, userLocations.userId))
      .execute();
    logger.info(data);
    res.status(200).json({ message: "Location Fetched Successfully", data });
  } catch (error) {
    logger.error("Failed to fetch all user locations", error);
  }
};
export default userLocationController;

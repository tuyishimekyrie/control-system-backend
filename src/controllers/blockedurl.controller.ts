import { Request, Response } from "express";
import { dbObj as db } from "../../drizzle/db";
import { URLFilter } from "../models";

export const insertBlockedURL = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const dbInstance = await db;

    if (!dbInstance) {
      throw new Error("Database instance is not initialized.");
    }

    // Insert the blocked URL into the database
    await dbInstance.insert(URLFilter).values({ url }).execute();

    res.status(201).json({ message: "URL successfully blocked" });
  } catch (error) {
    console.error("Error inserting blocked URL:", (error as Error).message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

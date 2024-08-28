import { Request, Response } from "express";
import { ZodError } from "zod";
import { LogService } from "../services/logs.service";
import { z } from "zod";
import { dbObj } from "../../drizzle/db";
import { blockedWebsites } from "../models/Blocked";
import { EventName, myEmitter } from "../utils/nodeEvents";

const LogSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  url: z.string().url(),
  duration: z.number(),
  timestamp: z.string().optional(),
});

const logService = new LogService();

export const logUserActivityController = async (
  req: Request,
  res: Response,
) => {
  try {
    const parseSchema = LogSchema.safeParse(req.body);
    if (!parseSchema.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parseSchema.error.errors,
      });
    }

    const { name, email, url, duration } = parseSchema.data;

    const blockedWebsite = await (
      await dbObj
    )
      .select()
      .from(blockedWebsites)
      .where({ url: url } as any);
    if (blockedWebsite) {
      myEmitter.emit(EventName.ACCESS_BLOCKED_WEBSITES, email);
    }

    // Log user activity regardless of whether the URL is blocked
    await logService.logUserActivity(name, email, url, duration);
    res.status(201).send("User activity logged successfully");
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Invalid data",
        errors: error.errors,
      });
    } else if (error instanceof Error) {
      return res.status(500).send(`Internal Server Error: ${error.message}`);
    } else {
      return res.status(500).send("Internal Server Error");
    }
  }
};

export const getAllLogsController = async (req: Request, res: Response) => {
  try {
    const logs = await logService.getAllLogs();
    res.status(200).json(logs);
  } catch (error: any) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

export const deleteAllLogsController = async (req: Request, res: Response) => {
  try {
    await logService.deleteAllLogs();
    res.status(200).send("All logs deleted successfully");
  } catch (error: any) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

export const getTotalTimeSpentPerWebsiteController = async (
  req: Request,
  res: Response,
) => {
  try {
    const logService = new LogService();
    const data = await logService.getTotalTimeSpentPerWebsite();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

import { Request, Response } from "express";
import { ZodError } from "zod";
import { LogService } from "../services/logs.service";
import { z } from "zod";

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
  res: Response
) => {
  try {
    console.log("Received data:", req.body);

    const parseSchema = LogSchema.safeParse(req.body);
    if (!parseSchema.success) {
      console.log("Validation failed:", parseSchema.error.errors);
      return res.status(400).json({
        message: "Validation failed",
        errors: parseSchema.error.errors,
      });
    }

    const { name, email, url, duration } = req.body;

    await logService.logUserActivity(name, email, url, duration);
    res.status(201).send("User activity logged successfully");
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: "Invalid data",
        errors: error.errors,
      });
    } else if (error instanceof Error) {
      res.status(500).send(`Internal Server Error: ${error.message}`);
    } else {
      res.status(500).send("Internal Server Error");
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

export const getLogByIdController = async (req: Request, res: Response) => {
  try {
    const log = await logService.getLogById(req.params.id);
    res.status(200).json(log);
  } catch (error: any) {
    res.status(404).send(`Log not found: ${error.message}`);
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

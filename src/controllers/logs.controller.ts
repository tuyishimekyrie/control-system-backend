import { Request, Response } from "express";
import { ZodError, z } from "zod";
import { LogService } from "../services/logs.service";

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

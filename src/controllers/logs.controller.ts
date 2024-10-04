import { Request, Response } from "express";
import { ZodError } from "zod";
import { LogService } from "../services/logs.service";
import { z } from "zod";
import { dbObj } from "../../drizzle/db";
import { blockedWebsites } from "../models/Blocked";
import { EventName, myEmitter } from "../utils/nodeEvents";
import { users } from "../models";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { logger } from "../utils/Logger";

const LogSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  url: z.string().url(),
  duration: z.number(),
  timestamp: z.string().optional(),
});

interface DecodedToken {
  email: string;
  name: string;
}
interface UserInfo {
  name: string | null;
  image: string | null;
  ipAddress: string | null;
  password: string | null;
  role: "user" | "manager" | "admin" | "parent" | "school";
  organizationId: string | null;
  isSubscribed: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  parentId: string | null;
  schoolId: string | null;
}

const logService = new LogService();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

const getUserFromToken = async (
  req: Request,
  res: Response,
): Promise<UserInfo | undefined> => {
  const token = req.headers.authorization?.split(" ")[1];
  logger.info(token);

  if (!token) {
    res.status(403).json({ message: "Please login!" });
    return undefined;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    const [userInfo] = await (await dbObj)
      .select()
      .from(users)
      .where(eq(users.email, decoded.email))
      .limit(1);

    if (!userInfo) {
      res.status(403).json({ message: "User not found!" });
      return undefined;
    }

    return userInfo as UserInfo;
  } catch (error: any) {
    res.status(401).json({ message: `Invalid token: ${error.message}` });
    return undefined;
  }
};

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

    const user = await (await dbObj)
      .select()
      .from(users)
      .where(eq(users.email, email));
    logger.info(user);

    if (user.length === 0) {
      return res.status(404).send(`User with email ${email} not found`);
    }

    const organizationId = user[0].organizationId;
    const parentId = user[0].parentId;
    const schoolId = user[0].schoolId;

    // Log user activity regardless of whether the URL is blocked
    await logService.logUserActivity(
      name,
      email,
      url,
      duration,
      organizationId,
      parentId,
      schoolId,
    );
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
    const userInfo = await getUserFromToken(req, res);
    logger.info(userInfo);
    if (!userInfo) return;
    logger.info(userInfo);

    const logs = await logService.getAllLogs(
      userInfo.role === "manager"
        ? (userInfo.organizationId ?? undefined)
        : undefined,
      userInfo.role === "parent" ? (userInfo.parentId ?? undefined) : undefined,
      userInfo.role === "school" ? (userInfo.schoolId ?? undefined) : undefined,
    );
    logger.info(logs);
    res.status(200).json(logs);
  } catch (error: any) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

export const deleteAllLogsController = async (req: Request, res: Response) => {
  try {
    const userInfo = await getUserFromToken(req, res);
    if (!userInfo) return;

    await logService.deleteAllLogs(
      userInfo.role === "manager"
        ? (userInfo.organizationId ?? undefined)
        : undefined,
      userInfo.role === "parent" ? (userInfo.parentId ?? undefined) : undefined,
      userInfo.role === "school" ? (userInfo.schoolId ?? undefined) : undefined,
    );
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
    const userInfo = await getUserFromToken(req, res);
    if (!userInfo) return;

    const filter = req.query.filter as string;

    const data = await logService.getTotalTimeSpentPerWebsite(
      userInfo.role === "manager"
        ? (userInfo.organizationId ?? undefined)
        : undefined,
      userInfo.role === "parent" ? (userInfo.parentId ?? undefined) : undefined,
      userInfo.role === "school" ? (userInfo.schoolId ?? undefined) : undefined,
      filter,
    );
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

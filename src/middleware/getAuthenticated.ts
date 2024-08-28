import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { users } from "../models";
import { dbObj } from "../../drizzle/db";
import { eq } from "drizzle-orm";
import { logger } from "../utils/Logger";

export interface CustomRequest extends Request {
  user?: any;
}

export const isAuthenticated: any = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token: ", token);

    if (!token) {
      res.status(401).send({
        message: "No token provided",
      });
      return;
    }

    const payload: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_secret_key",
    );

    if (!payload) {
      res.status(401).send({
        message: "Nothing in your token",
      });
      return;
    }

    const userResult = await (await dbObj)
      .select()
      .from(users)
      .where(eq(users.email, payload.email))
      .limit(1);

    const dbUser = userResult[0];

    if (!dbUser) {
      res.status(401).send({
        message: "User not found",
      });
      return;
    }

    req.user = dbUser;

    next();
  } catch (e: any) {
    logger.error(`Authentication error: ${e.message}`, e);
    res.status(401).send({
      message: `Authentication error: ${e.message}`,
    });
  }
};

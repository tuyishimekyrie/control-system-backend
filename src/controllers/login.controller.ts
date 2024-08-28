import { and, eq, or } from "drizzle-orm";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { dbObj } from "../../drizzle/db";
import { users } from "../models";
import { loginSchema } from "../validations";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logger } from "../utils/Logger";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
export const loginController = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const parseSchema = loginSchema.safeParse(body);
    if (!parseSchema.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parseSchema.error.errors,
      });
    }
    const userIsSubscribed = await (await dbObj)
      .select()
      .from(users)
      .where(eq(users.email, body.email))
      .limit(1);

    console.log("userIsSubscribed", userIsSubscribed);
    if (!userIsSubscribed[0]?.isSubscribed) {
      logger.error("Not Authorized");
      return res.status(400).json({
        message:
          "Not Authorized to use application, Please seek assistance from your manager",
      });
    }

    const usersResult = await (await dbObj)
      .select()
      .from(users)
      .where(eq(users.email, body.email))
      .limit(1);

    const dbUser = usersResult[0];
    logger.info(dbUser);

    if (!dbUser) {
      return res.status(400).send(`User with email ${body.email} not found`);
    }

    const { password } = body;

    const passwordMatch = await bcrypt.compare(password, dbUser.password!);

    if (passwordMatch) {
      // Create JWT token
      const token = jwt.sign(
        { email: dbUser.email, name: dbUser.name },
        JWT_SECRET,
        {
          expiresIn: "1h",
        },
      );

      // Set token in header
      res.setHeader("Authorization", `Bearer ${token}`);

      // Set token in cookie
      res.cookie("authToken", token, {
        httpOnly: true, // Helps prevent XSS attacks
        secure: process.env.NODE_ENV === "production", // Only set the cookie over HTTPS in production
        maxAge: 3600000, // 1 hour in milliseconds
      });

      res.status(200).json({
        message: "User logged in successfully",
        token,
        user: {
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
          organizationId: dbUser.organizationId,
        },
      });
    } else {
      res.status(400).send(`Invalid password`);
    }
  } catch (error: any) {
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

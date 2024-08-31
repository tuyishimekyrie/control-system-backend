import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { users } from "../models";
import { dbObj } from "../../drizzle/db";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface CustomRequest extends Request {
  user?: any;
}

export const authenticateMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Extract token from header or cookie
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Fetch user from database
    const usersResult = await (await dbObj)
      .select()
      .from(users)
      .where(eq(users.email, decoded.email))
      .limit(1);

    const dbUser = usersResult[0];

    if (!dbUser) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user info to request
    req.user = dbUser;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token!!" });
  }
};

// Middleware to check specific roles
export const authorizeMiddleware = (roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }
    next();
  };
};

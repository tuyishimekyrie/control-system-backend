import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../services";
import { users, UserType } from "../models";
import { dbObj } from "../../drizzle/db";
import { eq } from "drizzle-orm";
import NotificationService from "../services/notifications.service";

interface DecodedToken {
  email: string;
  name: string;
}
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export const getAllNotificationsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "Please login!" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    const user = decoded;
    const [userInfo] = await (await dbObj)
      .select()
      .from(users)
      .where(eq(users.email, user.email))
      .limit(1);
    const notifications = await NotificationService.getAllNotifications(
      userInfo.id,
    );

    res.status(200).json({
      message: "Notifications fetched successfully",
      notificationsNumber: notifications.length,
      notifications,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res
      .status(500)
      .json({ message: "An error occurred while fetching notifications" });
  }
};

import { Request, Response } from "express";
import { BlockedWebsiteService } from "../services/BlockedWebsiteService";
import { UserService } from "../services/users.service";
import { users } from "../models";
import { dbObj } from "../../drizzle/db";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

interface DecodedToken {
  email: string;
  name: string;
}
interface UserInfo {
  name: string | null;
  image: string | null;
  ipAddress: string | null;
  password: string | null;
  role: "user" | "manager" | "admin" | "school" | "parent";
  organizationId: string | null;
  schoolId: string | null;
  parentId: string | null;
  isSubscribed: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}

const userService = new UserService();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

const getUserFromToken = async (
  req: Request,
  res: Response,
): Promise<UserInfo | undefined> => {
  const token = req.headers.authorization?.split(" ")[1];

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

export class BlockedWebsiteController {
  private service: BlockedWebsiteService;

  constructor() {
    this.service = new BlockedWebsiteService();
  }

  public createBlockedWebsite = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const userInfo = await getUserFromToken(req, res);
      if (!userInfo) return;

      const { name, url } = req.body;

      let userId = "";
      if (userInfo.role === "manager") {
        userId = userInfo.organizationId || "";
      } else if (userInfo.role === "school") {
        userId = userInfo.schoolId || "";
      } else if (userInfo.role === "parent") {
        userId = userInfo.parentId || "";
      } else {
        res.status(403).json({ message: "Unauthorized role" });
        return;
      }

      await this.service.createBlockedWebsite(name, url, userId, userInfo.role);
      res.status(201).json({ message: "Website blocked successfully" });
    } catch (error: any) {
      if (error.code === "EPERM") {
        res.status(500).json({
          error:
            "Permission denied. Please run the application as an administrator.",
        });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  public getBlockedWebsites = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const userInfo = await getUserFromToken(req, res);
      if (!userInfo) return;

      let userId = "";
      if (userInfo.role === "manager") {
        userId = userInfo.organizationId || "";
      } else if (userInfo.role === "school") {
        userId = userInfo.schoolId || "";
      } else if (userInfo.role === "parent") {
        userId = userInfo.parentId || "";
      } else {
        res.status(403).json({ message: "Unauthorized role" });
        return;
      }

      const websites = await this.service.getBlockedWebsites(
        userId,
        userInfo.role,
      );
      res.status(200).json(websites);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public updateBlockedWebsite = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const userInfo = await getUserFromToken(req, res);
      if (!userInfo) return;

      const { id } = req.params;
      const { name, url } = req.body;

      let userId = "";
      if (userInfo.role === "manager") {
        userId = userInfo.organizationId || "";
      } else if (userInfo.role === "school") {
        userId = userInfo.schoolId || "";
      } else if (userInfo.role === "parent") {
        userId = userInfo.parentId || "";
      } else {
        res.status(403).json({ message: "Unauthorized role" });
        return;
      }

      await this.service.updateBlockedWebsite(
        id,
        name,
        url,
        userId,
        userInfo.role,
      );
      res.status(200).json({ message: "Blocked website updated successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public deleteBlockedWebsite = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const userInfo = await getUserFromToken(req, res);
      if (!userInfo) return;

      const { id } = req.params;

      let userId = "";
      if (userInfo.role === "manager") {
        userId = userInfo.organizationId || "";
      } else if (userInfo.role === "school") {
        userId = userInfo.schoolId || "";
      } else if (userInfo.role === "parent") {
        userId = userInfo.parentId || "";
      } else {
        res.status(403).json({ message: "Unauthorized role" });
        return;
      }

      await this.service.deleteBlockedWebsite(id, userId, userInfo.role);
      res.status(200).json({ message: "Blocked website deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

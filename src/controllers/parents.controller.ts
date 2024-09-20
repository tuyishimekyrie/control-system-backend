import { Request, Response } from "express";
import { ParentService } from "../services/parents.service";
import { ParentUpdateSchema } from "../validations/orgSchema";
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
  parentId: string | null;
  isSubscribed: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}

const parentService = new ParentService();
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

export const getParentsController = async (req: Request, res: Response) => {
  try {
    const userInfo = await getUserFromToken(req, res);
    if (!userInfo) return;

    if (userInfo.role !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to view all parents",
      });
    }

    const parents = await parentService.getAllParents();
    res.status(200).json(parents);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

export const getParentByIdController = async (req: Request, res: Response) => {
  try {
    const userInfo = await getUserFromToken(req, res);
    if (!userInfo) return;

    if (userInfo.role !== "admin" && userInfo.role !== "parent") {
      return res.status(403).json({
        message: "You do not have permission to view this parent",
      });
    }

    const { id } = req.params;

    const parent = await parentService.getParentById(id);

    res.status(200).json(parent);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

export const updateParentController = async (req: Request, res: Response) => {
  try {
    const userInfo = await getUserFromToken(req, res);
    if (!userInfo) return;

    const { id } = req.params;
    const parseSchema = ParentUpdateSchema.safeParse(req.body);
    if (!parseSchema.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parseSchema.error.errors,
      });
    }
    const updateData = parseSchema.data;

    if (userInfo.role === "admin") {
      await parentService.updateParent(id, updateData);
      return res.status(200).send("Parent updated successfully");
    } else if (userInfo.role === "parent") {
      if ("maxUsers" in updateData) {
        return res.status(403).json({
          message: "You do not have permission to update max users",
        });
      }
      await parentService.updateParent(id, {
        name: updateData.name,
      });
      return res.status(200).send("Parent name updated successfully");
    } else {
      return res.status(403).json({
        message: "You do not have permission to update this parent",
      });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

export const deleteParentController = async (req: Request, res: Response) => {
  try {
    const userInfo = await getUserFromToken(req, res);
    if (!userInfo) return;

    if (userInfo.role !== "admin" && userInfo.role !== "parent") {
      return res.status(403).json({
        message: "You do not have permission to delete this parent",
      });
    }

    const { id } = req.params;

    await parentService.deleteParent(id);
    res.status(200).send("Parent deleted successfully");
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

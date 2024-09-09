import { Request, Response } from "express";
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
  role: "user" | "manager" | "admin";
  organizationId: string | null;
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

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const userInfo = await getUserFromToken(req, res);
    if (!userInfo) return;

    const users = await userService.getAllUsers(
      userInfo.role === "manager"
        ? (userInfo.organizationId ?? undefined)
        : undefined,
    );
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const userInfo = await getUserFromToken(req, res);
    if (!userInfo) return;

    const { id } = req.params;
    const user = await userService.getUserById(
      id,
      userInfo.role === "manager"
        ? (userInfo.organizationId ?? undefined)
        : undefined,
    );
    res.status(200).json(user);
  } catch (error: any) {
    res.status(404).send(`User not found: ${error.message}`);
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const userInfo = await getUserFromToken(req, res);
    if (!userInfo) return;

    const { email } = req.params;
    const user = await userService.getUserByEmail(
      email,
      userInfo.role === "manager"
        ? (userInfo.organizationId ?? undefined)
        : undefined,
    );
    res.status(200).json(user);
  } catch (error: any) {
    res.status(404).send(`User not found: ${error.message}`);
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const userInfo = await getUserFromToken(req, res);
    if (!userInfo) return;

    const { id } = req.params;
    await userService.updateUser(
      id,
      req.body,
      userInfo.role === "manager"
        ? (userInfo.organizationId ?? undefined)
        : undefined,
    );
    res.status(200).json({ message: "User updated successfully" });
  } catch (error: any) {
    res.status(404).send(`User not found: ${error.message}`);
  }
};

export const deleteUserByIdController = async (req: Request, res: Response) => {
  try {
    const userInfo = await getUserFromToken(req, res);
    if (!userInfo) return;

    const { id } = req.params;
    await userService.deleteUserById(
      id,
      userInfo.role === "manager"
        ? (userInfo.organizationId ?? undefined)
        : undefined,
    );
    res.status(200).json({ message: "user deleted successfully" });
  } catch (error: any) {
    res.status(404).send(`User not found: ${error.message}`);
  }
};

export const deleteAllUsersController = async (req: Request, res: Response) => {
  try {
    const userInfo = await getUserFromToken(req, res);
    if (!userInfo) return;

    await userService.deleteAllUsers(
      userInfo.role === "manager"
        ? (userInfo.organizationId ?? undefined)
        : undefined,
    );
    res.status(200).json({ message: "All users deleted successfully" });
  } catch (error: any) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

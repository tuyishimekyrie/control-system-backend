import { Request, Response } from "express";
import { OrganizationService } from "../services/organization.service";
import { OrganizationUpdateSchema } from "../validations/orgSchema";
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

const organizationService = new OrganizationService();
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

export const getOrganizationsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userInfo = await getUserFromToken(req, res);
    if (!userInfo) return;

    if (userInfo.role !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to view all organizations",
      });
    }

    const organizations = await organizationService.getAllOrganizations();
    res.status(200).json(organizations);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

export const getOrganizationByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userInfo = await getUserFromToken(req, res);
    if (!userInfo) return;

    if (userInfo.role !== "admin" && userInfo.role !== "manager") {
      return res.status(403).json({
        message: "You do not have permission to view this organization",
      });
    }

    const { id } = req.params;

    const organization = await organizationService.getOrganizationById(id);

    res.status(200).json(organization);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

export const updateOrganizationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userInfo = await getUserFromToken(req, res);
    if (!userInfo) return;

    const { id } = req.params;
    const parseSchema = OrganizationUpdateSchema.safeParse(req.body);
    if (!parseSchema.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parseSchema.error.errors,
      });
    }
    const updateData = parseSchema.data;

    if (userInfo.role === "admin") {
      await organizationService.updateOrganization(id, updateData);
      return res.status(200).send("Organization updated successfully");
    } else if (userInfo.role === "manager") {
      if ("maxUsers" in updateData) {
        return res.status(403).json({
          message: "You do not have permission to update max users",
        });
      }
      await organizationService.updateOrganization(id, {
        name: updateData.name,
      });
      return res.status(200).send("Organization name updated successfully");
    } else {
      return res.status(403).json({
        message: "You do not have permission to update this organization",
      });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

export const deleteOrganizationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userInfo = await getUserFromToken(req, res);
    if (!userInfo) return;

    if (userInfo.role !== "admin" && userInfo.role !== "manager") {
      return res.status(403).json({
        message: "You do not have permission to delete this organization",
      });
    }

    const { id } = req.params;

    await organizationService.deleteOrganization(id);
    res.status(200).send("Organization deleted successfully");
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

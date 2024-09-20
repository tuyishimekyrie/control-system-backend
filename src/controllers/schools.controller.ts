import { Request, Response } from "express";
import { SchoolService } from "../services/schools.service";
import { SchoolUpdateSchema } from "../validations/orgSchema";
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
  schoolId: string | null;
  isSubscribed: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}

const schoolService = new SchoolService();
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

export const getSchoolsController = async (req: Request, res: Response) => {
  try {
    const userInfo = await getUserFromToken(req, res);
    if (!userInfo) return;

    if (userInfo.role !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to view all schools",
      });
    }

    const schools = await schoolService.getAllSchools();
    res.status(200).json(schools);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

export const getSchoolByIdController = async (req: Request, res: Response) => {
  try {
    const userInfo = await getUserFromToken(req, res);
    if (!userInfo) return;

    if (userInfo.role !== "admin" && userInfo.role !== "school") {
      return res.status(403).json({
        message: "You do not have permission to view this school",
      });
    }

    const { id } = req.params;

    const school = await schoolService.getSchoolById(id);

    res.status(200).json(school);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

export const updateSchoolController = async (req: Request, res: Response) => {
  try {
    const userInfo = await getUserFromToken(req, res);
    if (!userInfo) return;

    const { id } = req.params;
    const parseSchema = SchoolUpdateSchema.safeParse(req.body);
    if (!parseSchema.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parseSchema.error.errors,
      });
    }
    const updateData = parseSchema.data;

    if (userInfo.role === "admin") {
      await schoolService.updateSchool(id, updateData);
      return res.status(200).send("School updated successfully");
    } else if (userInfo.role === "school") {
      if ("maxUsers" in updateData) {
        return res.status(403).json({
          message: "You do not have permission to update max users",
        });
      }
      await schoolService.updateSchool(id, {
        name: updateData.name,
      });
      return res.status(200).send("School name updated successfully");
    } else {
      return res.status(403).json({
        message: "You do not have permission to update this school",
      });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

export const deleteSchoolController = async (req: Request, res: Response) => {
  try {
    const userInfo = await getUserFromToken(req, res);
    if (!userInfo) return;

    if (userInfo.role !== "admin" && userInfo.role !== "school") {
      return res.status(403).json({
        message: "You do not have permission to delete this school",
      });
    }

    const { id } = req.params;

    await schoolService.deleteSchool(id);
    res.status(200).send("School deleted successfully");
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { dbObj } from "../../drizzle/db";
import { users } from "../models";
import { UserService } from "../services";
import { UserSchema } from "../validations";

const userService = new UserService();

export const registerController = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const parseSchema = UserSchema.safeParse(body);
    if (!parseSchema.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parseSchema.error.errors,
      });
    }

    const {
      name,
      email,
      image,
      password,
      role,
      isOrganization,
      organizationId,
      orgName,
    } = body;

    if (isOrganization) {
      if (role === "manager") {
        if (!orgName) {
          return res.status(400).json({
            message: "Organization name is required for manager registration",
          });
        }
        await userService.registerOrganizationAndManager(
          orgName,
          name,
          email,
          password,
          image,
        );
        return res
          .status(201)
          .send("Organization and manager registered successfully");
      } else {
        return res.status(400).json({
          message: "Invalid role for organization registration",
        });
      }
    }

    if (role === "admin" && organizationId) {
      return res.status(400).json({
        message: "Admin cannot be associated with an organization",
      });
    }

    const usersResult = await ((await dbObj).select() as any)
      .from(users)
      .where(eq(users.email, email))
      .where(eq(users.organizationId, organizationId || null))
      .limit(1);

    if (usersResult.length > 0) {
      return res.status(400).send(`User with email ${email} already exists`);
    }

    await userService.registerUser(
      name,
      email,
      image,
      password,
      role,
      organizationId,
    );
    res.status(201).send("User registered successfully");
  } catch (error) {
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

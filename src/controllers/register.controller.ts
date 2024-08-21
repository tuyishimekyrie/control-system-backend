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

    const usersResult = await (await dbObj)
      .select()
      .from(users)
      .where(eq(users.email, body.email))
      .limit(1);

    let dbUser = usersResult[0];

    if (dbUser)
      return res
        .status(400)
        .send(`User with email ${body.email} already exists`);

    const { name, email, image, password } = body;

    await userService.registerUser(name, email, image, password);
    res.status(201).send(`User registered successfully`);
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

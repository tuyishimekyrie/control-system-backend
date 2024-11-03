import { and, eq, is, or } from "drizzle-orm";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { dbObj } from "../../drizzle/db";
import { users } from "../models";
import { loginSchema } from "../validations";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logger } from "../utils/Logger";
import nodemailer from "nodemailer";

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
          userId: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
          organizationId: dbUser.organizationId,
          parentId: dbUser.parentId,
          schoolId: dbUser.schoolId,
          image: dbUser.image,
          isSubscribed: dbUser.isSubscribed,
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

const PASSWORD_RESET_SECRET = "DROWaSSAP";
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const usersResult = await (await dbObj)
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const dbUser = usersResult[0];

    if (!dbUser || !dbUser.email) {
      return res
        .status(404)
        .json({ message: `User with email ${email} wasn't found` });
    }

    const resetToken = jwt.sign(
      { email: dbUser.email },
      PASSWORD_RESET_SECRET,
      { expiresIn: "1h" },
    );

    const resetLink = `https://staging-control-system.netlify.app/auth/reset-password?token=${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center;">
          <h1 style="font-size: 40px; color: #16A34A">NEFTELLA</h1>
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin-bottom: 20px;">

        <p style="font-size: 14px; color: #333;">
          Hi, 
        </p>
        <p style="font-size: 14px; color: #333;">
          We've received a request to reset the password for your account associated with this email: <strong>${dbUser.email}</strong>. Click the button below to set your new password.
        </p>

        <div style="margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #16A34A; color: #fff; padding: 10px; text-decoration: none; border-radius: 5px; font-size: 14px;">Set Password</a>
        </div>

        <p style="font-size: 14px; color: #555;">
          Or copy this link into your browser if the button does not work:
        </p>
        <p style="word-wrap: break-word; font-size: 14px; color: #007bff;">
          <a href="${resetLink}" style="color: #007bff;">${resetLink}</a>
        </p>

        <p style="font-size: 14px; color: #555;">
          If you did not request this, you can safely ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin-top: 30px;">

        <p style="font-size: 12px; color: #777; text-align: center;">
          This message was sent to you by <strong><a href="https://netfella.rw/" style="color: #16A34A; text-decoration: none;">Netfella</a></strong>.
        </p>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 587,
      secure: true,
      auth: {
        user: "twizald.01@gmail.com",
        pass: "xocybhzqbhpvjysw",
      },
    });

    const mailOptions = {
      from: "NetFella <twizald.01@gmail.com>",
      to: dbUser.email,
      subject: "Password Reset Request",
      html: html,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Password reset link sent to your email.",
    });
  } catch (error: any) {
    logger.error("Error in requestPasswordReset: ", error);
    res.status(500).json(error);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    const decoded: any = jwt.verify(token, PASSWORD_RESET_SECRET);

    if (!decoded.email) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset password link." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await (await dbObj)
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, decoded.email));

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password." });
  }
};

export const getUserByEmailController = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const usersResult = await (await dbObj)
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const dbUser = usersResult[0];

    if (!dbUser) {
      return res
        .status(404)
        .json({ message: `User with email ${email} not found` });
    }

    res.status(200).json({
      message: `User with email ${email} exists`,
      user: dbUser,
    });
  } catch (error: any) {
    logger.error("Error in getUserByEmailController: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { dbObj } from "../../drizzle/db";
import { users } from "../models";
import { UserService } from "../services";
import { UserSchema } from "../validations";
import DeviceDetector = require("device-detector-js");

const userService = new UserService();

const getClientIp = (req: any) => {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  const ipv4 = ip.includes("::ffff:") ? ip.split("::ffff:")[1] : ip;
  return ipv4;
};

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

    const { email, password, role, isOrganization, organizationId, orgName } =
      body;

    const userAgent = req.headers["user-agent"] || "";
    console.log(`User-Agent: ${userAgent}`);
    const deviceDetector = new DeviceDetector();
    const device = deviceDetector.parse(userAgent);
    console.log(`Device Info: ${JSON.stringify(device, null, 2)}`);
    const deviceName = `${device.device?.brand} ${device.device?.model}`;

    const ipAddress = getClientIp(req);
    console.log(`IP Address: ${ipAddress}`);

    if (isOrganization) {
      if (role === "manager") {
        if (!orgName) {
          return res.status(400).json({
            message: "Organization name is required for manager registration",
          });
        }
        await userService.registerOrganizationAndManager(
          orgName,
          email,
          password,
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

    if (role === "user") {
      if (!organizationId) {
        return res.status(400).json({
          message: "Organization ID is required for user (device) registration",
        });
      }

      const usersResult = await ((await dbObj).select() as any)
        .from(users)
        .where(eq(users.organizationId, organizationId))
        .where(eq(users.email, email))
        .limit(1);

      if (usersResult.length > 0) {
        return res
          .status(400)
          .send(
            `Device with email ${email} already exists under this organization`,
          );
      }

      if (!ipAddress) {
        return res.status(400).json({
          message: "IP Address is required for user (device) registration",
        });
      }

      await userService.registerDevice(
        deviceName,
        ipAddress,
        email,
        password,
        organizationId,
      );
      return res.status(201).send("Device registered successfully");
    }

    return res.status(400).json({
      message: "Invalid role for registration",
    });
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

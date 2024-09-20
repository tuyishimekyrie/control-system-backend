import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { dbObj } from "../../drizzle/db";
import { users } from "../models";
import { UserService } from "../services";
import { UserSchema } from "../validations";
import DeviceDetector = require("device-detector-js");
import { organizations } from "../models/organizations";
import { parents } from "../models/parents";
import { schools } from "../models/schools";

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
    console.log("body:", body);
    const parseSchema = UserSchema.safeParse(body);
    if (!parseSchema.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parseSchema.error.errors,
      });
    }

    const {
      email,
      password,
      role,
      isOrganization,
      organizationId,
      isSchool,
      schoolId,
      isParent,
      parentId,
      orgName,
      schoolName,
      parentName,
      macAddress,
    } = body;

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
          .json({ message: "Organization registered successfully" });
      } else {
        return res.status(400).json({
          message: "Invalid role for organization registration",
        });
      }
    }
    if (isSchool) {
      if (role === "school") {
        if (!schoolName) {
          return res.status(400).json({
            message: "School name is required for school registration",
          });
        }
        await userService.registerSchool(schoolName, email, password);
        return res
          .status(201)
          .json({ message: "School registered successfully" });
      } else {
        return res.status(400).json({
          message: "Invalid role for school registration",
        });
      }
    }
    if (isParent) {
      if (role === "parent") {
        if (!parentName) {
          return res.status(400).json({
            message: "Parent name is required for parent registration",
          });
        }
        await userService.registerParent(parentName, email, password);
        return res
          .status(201)
          .json({ message: "Parent registered successfully" });
      } else {
        return res.status(400).json({
          message: "Invalid role for parent registration",
        });
      }
    }

    if (role === "user") {
      if (!organizationId && !schoolId && !parentId) {
        return res.status(400).json({
          message: "Entity ID is required for device registration",
        });
      }

      let entity;
      let entityType;
      if (organizationId) {
        entity = organizationId;
        entityType = organizations;
      } else if (schoolId) {
        entity = schoolId;
        entityType = schools;
      } else {
        entity = parentId;
        entityType = parents;
      }

      const usersResult = await ((await dbObj).select() as any)
        .from(users)
        .where(eq(users.organizationId, entity));

      const emailExists = usersResult.some(
        (user: { email: any }) => user.email === email,
      );
      const macAddressExists = usersResult.some(
        (user: { macAddress: any }) => user.macAddress === macAddress,
      );

      if (emailExists && macAddressExists) {
        return res.status(400).json({
          message:
            "User with this email and MAC address already exists under this entity",
        });
      } else if (emailExists) {
        return res.status(400).json({
          message: "User with this email already exists under this entity",
        });
      } else if (macAddressExists) {
        return res.status(400).json({
          message:
            "Device with this MAC address already exists under this entity",
        });
      }

      if (!ipAddress) {
        return res.status(400).json({
          message: "IP Address is required for user (device) registration",
        });
      }

      if (!macAddress) {
        return res.status(400).json({
          message: "MAC Address is required for user (device) registration",
        });
      } else {
        console.log("MAC Address: ", macAddress);
      }

      const entityResult = await ((await dbObj).select() as any)
        .from(entityType)
        .where(eq(entityType.id, entity));

      if (usersResult.length >= entityResult[0].maxUsers) {
        return res.status(400).json({
          message:
            "You have reached the allowed number of users for this entity",
        });
      }

      await userService.registerDevice(
        deviceName,
        ipAddress,
        macAddress,
        email,
        password,
        organizationId ? organizationId : undefined,
        schoolId ? schoolId : undefined,
        parentId ? parentId : undefined,
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

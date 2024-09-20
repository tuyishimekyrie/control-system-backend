import { eq } from "drizzle-orm";
import { dbObj } from "../../drizzle/db";
import { users } from "../models/User";
import bcrypt from "bcryptjs";
import { organizations } from "../models/organizations";
import { parents } from "../models/parents";
import { schools } from "../models/schools";

export class UserService {
  static getUserByEmail(email: string) {
    throw new Error("Method not implemented.");
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public async registerDevice(
    deviceName: string,
    ipAddress: string,
    macAddress: string,
    email: string,
    password: string,
    organizationId?: string,
    schoolId?: string,
    parentId?: string,
  ): Promise<void> {
    try {
      const hashedPassword = await this.hashPassword(password);

      await (await dbObj).insert(users).values({
        name: deviceName,
        ipAddress,
        macAddress,
        email,
        password: hashedPassword,
        role: "user",
        organizationId: organizationId,
        schoolId: schoolId,
        parentId: parentId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("Device registered successfully");
    } catch (error: any) {
      console.error(`Error registering device: ${error.message}`);
      throw error;
    }
  }

  public async registerOrganizationAndManager(
    orgName: string,
    email: string,
    password: string,
  ): Promise<void> {
    try {
      let organization = await (await dbObj)
        .select()
        .from(organizations)
        .where(eq(organizations.name, orgName))
        .limit(1);

      let orgId: string;

      if (organization.length > 0) {
        orgId = organization[0].id;
      } else {
        orgId = crypto.randomUUID();
        await (await dbObj).insert(organizations).values({
          id: orgId,
          name: orgName,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await (await dbObj).insert(users).values({
        name: orgName,
        email,
        password: await this.hashPassword(password),
        role: "manager",
        organizationId: orgId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("Organization and manager registered successfully");
    } catch (error: any) {
      console.error(
        `An error occurred while registering your organization: ${error.message}`,
      );
      throw error;
    }
  }

  public async registerParent(
    parentName: string,
    email: string,
    password: string,
  ): Promise<void> {
    try {
      let parent = await (await dbObj)
        .select()
        .from(parents)
        .where(eq(parents.name, parentName))
        .limit(1);

      let parentId: string;

      if (parent.length > 0) {
        parentId = parent[0].id;
      } else {
        parentId = crypto.randomUUID();
        await (await dbObj).insert(parents).values({
          id: parentId,
          name: parentName,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await (await dbObj).insert(users).values({
        name: parentName,
        email,
        password: await this.hashPassword(password),
        role: "parent",
        parentId: parentId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("Parent registered successfully");
    } catch (error: any) {
      console.error(
        `An error occurred while registering the parent: ${error.message}`,
      );
      throw error;
    }
  }

  public async registerSchool(
    schoolName: string,
    email: string,
    password: string,
  ): Promise<void> {
    try {
      let school = await (await dbObj)
        .select()
        .from(schools)
        .where(eq(schools.name, schoolName))
        .limit(1);

      let schoolId: string;

      if (school.length > 0) {
        schoolId = school[0].id;
      } else {
        schoolId = crypto.randomUUID();
        await (await dbObj).insert(schools).values({
          id: schoolId,
          name: schoolName,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await (await dbObj).insert(users).values({
        name: schoolName,
        email,
        password: await this.hashPassword(password),
        role: "school",
        schoolId: schoolId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("School registered successfully");
    } catch (error: any) {
      console.error(
        `An error occurred while registering the school: ${error.message}`,
      );
      throw error;
    }
  }
}

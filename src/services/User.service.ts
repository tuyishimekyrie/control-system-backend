import { eq } from "drizzle-orm";
import { dbObj } from "../../drizzle/db";
import { users } from "../models/User";
import bcrypt from "bcryptjs";
import { organizations } from "../models/organizations";

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
    email: string,
    password: string,
    organizationId: string,
  ): Promise<void> {
    try {
      const hashedPassword = await this.hashPassword(password);

      await (await dbObj).insert(users).values({
        name: deviceName,
        ipAddress,
        email,
        password: hashedPassword,
        role: "user",
        organizationId,
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
}

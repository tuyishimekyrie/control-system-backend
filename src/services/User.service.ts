import { eq } from "drizzle-orm";
import { dbObj } from "../../drizzle/db";
import { users } from "../models/User";
import { organizations } from "../models/organizations";
import bcrypt from "bcryptjs";

export class UserService {
  static getUserByEmail(email: string) {
      throw new Error("Method not implemented.");
  }
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public async registerUser(
    name: string,
    email: string,
    image: string | null,
    password: string,
    role: "user" | "manager" | "admin",
    organizationId?: string,
  ): Promise<void> {
    try {
      const hashedPassword = await this.hashPassword(password);

      await (await dbObj).insert(users).values({
        name,
        email,
        image,
        password: hashedPassword,
        role,
        organizationId: role === "admin" ? null : organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("User registered successfully");
    } catch (error: any) {
      console.error(`Error registering user: ${error.message}`);
      throw error;
    }
  }

  public async registerOrganizationAndManager(
    orgName: string,
    managerName: string,
    email: string,
    password: string,
    image: string | null,
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

      await this.registerUser(
        managerName,
        email,
        image,
        password,
        "manager",
        orgId,
      );

      console.log("Your Organizatiion is successfully registered");
    } catch (error: any) {
      console.error(
        `An Error occured while registering your organization: ${error.message}`,
      );
      throw error;
    }
  }
  
}

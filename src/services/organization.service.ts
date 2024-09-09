import { eq } from "drizzle-orm";
import { dbObj } from "../../drizzle/db";
import { organizations } from "../models/organizations";

export class OrganizationService {
  public async getAllOrganizations() {
    try {
      return await (await dbObj).select().from(organizations);
    } catch (error: any) {
      console.error(`Error fetching organizations: ${error.message}`);
      throw error;
    }
  }

  public async getOrganizationById(id: string) {
    try {
      const organization = await (await dbObj)
        .select()
        .from(organizations)
        .where(eq(organizations.id, id))
        .limit(1);

      if (organization.length === 0) {
        throw new Error("Organization not found");
      }

      return organization[0];
    } catch (error: any) {
      console.error(`Error fetching organization: ${error.message}`);
      throw error;
    }
  }

  public async updateOrganization(
    id: string,
    data: Partial<{ name: string; maxUsers: number }>,
  ) {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date(),
      };

      await (await dbObj)
        .update(organizations)
        .set(updateData)
        .where(eq(organizations.id, id));

      console.log("Organization updated successfully");
    } catch (error: any) {
      console.error(`Error updating organization: ${error.message}`);
      throw error;
    }
  }

  public async deleteOrganization(id: string) {
    try {
      await (await dbObj).delete(organizations).where(eq(organizations.id, id));
      console.log("Organization deleted successfully");
    } catch (error: any) {
      console.error(`Error deleting organization: ${error.message}`);
      throw error;
    }
  }
}

import { eq } from "drizzle-orm";
import { dbObj } from "../../drizzle/db";
import { schools } from "../models/schools";

export class SchoolService {
  public async getAllSchools() {
    try {
      return await (await dbObj).select().from(schools);
    } catch (error: any) {
      console.error(`Error fetching schools: ${error.message}`);
      throw error;
    }
  }

  public async getSchoolById(id: string) {
    try {
      const school = await (await dbObj)
        .select()
        .from(schools)
        .where(eq(schools.id, id))
        .limit(1);

      if (school.length === 0) {
        throw new Error("School not found");
      }

      return school[0];
    } catch (error: any) {
      console.error(`Error fetching school: ${error.message}`);
      throw error;
    }
  }

  public async updateSchool(
    id: string,
    data: Partial<{ name: string; maxUsers: number }>,
  ) {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date(),
      };

      await (await dbObj)
        .update(schools)
        .set(updateData)
        .where(eq(schools.id, id));

      console.log("School updated successfully");
    } catch (error: any) {
      console.error(`Error updating school: ${error.message}`);
      throw error;
    }
  }

  public async deleteSchool(id: string) {
    try {
      await (await dbObj).delete(schools).where(eq(schools.id, id));
      console.log("School deleted successfully");
    } catch (error: any) {
      console.error(`Error deleting school: ${error.message}`);
      throw error;
    }
  }
}

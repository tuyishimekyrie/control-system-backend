import { eq } from "drizzle-orm";
import { dbObj } from "../../drizzle/db";
import { parents } from "../models/parents";

export class ParentService {
  public async getAllParents() {
    try {
      return await (await dbObj).select().from(parents);
    } catch (error: any) {
      console.error(`Error fetching parents: ${error.message}`);
      throw error;
    }
  }

  public async getParentById(id: string) {
    try {
      const parent = await (await dbObj)
        .select()
        .from(parents)
        .where(eq(parents.id, id))
        .limit(1);

      if (parent.length === 0) {
        throw new Error("Parent not found");
      }

      return parent[0];
    } catch (error: any) {
      console.error(`Error fetching parent: ${error.message}`);
      throw error;
    }
  }

  public async updateParent(
    id: string,
    data: Partial<{ name: string; maxUsers: number }>,
  ) {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date(),
      };

      await (await dbObj)
        .update(parents)
        .set(updateData)
        .where(eq(parents.id, id));

      console.log("parent updated successfully");
    } catch (error: any) {
      console.error(`Error updating parent: ${error.message}`);
      throw error;
    }
  }

  public async deleteParent(id: string) {
    try {
      await (await dbObj).delete(parents).where(eq(parents.id, id));
      console.log("Parent deleted successfully");
    } catch (error: any) {
      console.error(`Error deleting parent: ${error.message}`);
      throw error;
    }
  }
}

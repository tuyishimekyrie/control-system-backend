import { dbObj } from "../../drizzle/db";
import { userLogs } from "../models/userlogs";
import { eq } from "drizzle-orm";

export class LogService {
  public async logUserActivity(
    name: string,
    email: string,
    url: string,
    duration: number
  ): Promise<void> {
    try {
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      const seconds = Math.floor(duration % 60);
      const timeValue = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      await (await dbObj).insert(userLogs).values({
        name,
        email,
        url,
        duration: timeValue,
        date: new Date(),
      });

      console.log("User activity logged successfully");
    } catch (error: any) {
      console.error(`Error logging user activity: ${error.message}`);
      throw error;
    }
  }

  public async getAllLogs() {
    try {
      return await (await dbObj).select().from(userLogs);
    } catch (error: any) {
      console.error(`Error fetching logs: ${error.message}`);
      throw error;
    }
  }

  public async getLogById(id: string) {
    try {
      const log = await (await dbObj)
        .select()
        .from(userLogs)
        .where(eq(userLogs.id, id))
        .limit(1);

      if (log.length === 0) {
        throw new Error("Log not found");
      }

      return log[0];
    } catch (error: any) {
      console.error(`Error fetching log by ID: ${error.message}`);
      throw error;
    }
  }

  public async deleteAllLogs() {
    try {
      await (await dbObj).delete(userLogs);
      console.log("All logs deleted successfully");
    } catch (error: any) {
      console.error(`Error deleting all logs: ${error.message}`);
      throw error;
    }
  }
}

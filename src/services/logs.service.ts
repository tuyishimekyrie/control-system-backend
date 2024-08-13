import { dbObj } from "../../drizzle/db";
import { userLogs } from "../models/userlogs";

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
}

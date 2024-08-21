import { dbObj } from "../../drizzle/db";
import { userLogs } from "../models/userlogs";
import { eq, sum } from "drizzle-orm";
import { getBaseDomain } from "../utils/ParsingUrl";

export class LogService {
  public async logUserActivity(
    name: string,
    email: string,
    url: string,
    duration: number,
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

  public async deleteAllLogs() {
    try {
      await (await dbObj).delete(userLogs);
      console.log("All logs deleted successfully");
    } catch (error: any) {
      console.error(`Error deleting all logs: ${error.message}`);
      throw error;
    }
  }
  public async getTotalTimeSpentPerWebsite() {
    try {
      const database = await dbObj;

      const logs = await database.select().from(userLogs);

      const aggregatedData = logs.reduce((acc: any, log: any) => {
        const baseDomain = getBaseDomain(log.url);
        if (!acc[baseDomain]) {
          acc[baseDomain] = 0;
        }
        acc[baseDomain] += this.parseDuration(log.duration);
        return acc;
      }, {});

      const result = Object.keys(aggregatedData).map((domain) => ({
        url: domain,
        totalDuration: aggregatedData[domain],
      }));

      const top10Result = result
        .sort((a, b) => b.totalDuration - a.totalDuration)
        .slice(0, 10);

      console.log("Top 10 websites by total time spent:");
      console.log(top10Result);

      return top10Result;
    } catch (error: any) {
      console.error(
        `Error fetching total time spent per website: ${error.message}`,
      );
      throw error;
    }
  }

  private parseDuration(duration: string): number {
    const [hours, minutes, seconds] = duration.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }
}

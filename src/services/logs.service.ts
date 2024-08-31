import { dbObj } from "../../drizzle/db";
import { userLogs } from "../models/userlogs";
import { eq, sum, and } from "drizzle-orm";
import { getBaseDomain } from "../utils/ParsingUrl";
import { users } from "../models";

export class LogService {
  public async logUserActivity(
    name: string,
    email: string,
    url: string,
    duration: number,
    organizationId?: string | null,
  ): Promise<void> {
    try {
      if (!organizationId) {
        const user = await (await dbObj)
          .select()
          .from(users)
          .where(eq(users.email, email));
        if (user.length === 0) {
          throw new Error(`User with email ${email} not found`);
        }
        organizationId = user[0].organizationId ?? undefined;
      }

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
        organizationId,
        duration: timeValue,
        date: new Date(),
      });

      console.log("User activity logged successfully");
    } catch (error: any) {
      console.error(`Error logging user activity: ${error.message}`);
      throw error;
    }
  }

  public async getAllLogs(organizationId?: string): Promise<any[]> {
    try {
      const query = (await dbObj).select().from(userLogs);
      if (organizationId) {
        query.where(eq(userLogs.organizationId, organizationId));
      }
      return await query;
    } catch (error: any) {
      console.error(`Error fetching logs: ${error.message}`);
      throw error;
    }
  }

  public async deleteAllLogs(organizationId?: string): Promise<void> {
    try {
      const query = (await dbObj).delete(userLogs);
      if (organizationId) {
        query.where(eq(userLogs.organizationId, organizationId));
      }
      await query;
      console.log("All logs deleted successfully");
    } catch (error: any) {
      console.error(`Error deleting all logs: ${error.message}`);
      throw error;
    }
  }

  public async getTotalTimeSpentPerWebsite(organizationId?: string) {
    try {
      const database = await dbObj;

      const query = database.select().from(userLogs);
      if (organizationId) {
        query.where(eq(userLogs.organizationId, organizationId));
      }

      const logs = await query;

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

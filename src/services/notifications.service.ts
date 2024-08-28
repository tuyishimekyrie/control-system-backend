import { eq } from "drizzle-orm";
import { dbObj } from "../../drizzle/db";
import { notifications } from "../models/Notifications";

class NotificationService {
  public static async getAllNotifications(id: string) {
    try {
      return await (await dbObj)
        .select()
        .from(notifications)
        .where(eq(notifications.userId, id));
    } catch (error: any) {
      console.error(`Error fetching notifications: ${error.message}`);
      throw error;
    }
  }
}

export default NotificationService;

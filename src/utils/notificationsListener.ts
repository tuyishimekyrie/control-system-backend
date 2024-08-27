import { eq, and } from "drizzle-orm";
import { dbObj } from "../../drizzle/db";
import { users, UserType } from "../models";
import { notifications, NewNotification } from "../models/Notifications";
import { EventName, myEmitter } from "./nodeEvents";

export const myEventListener = () => {
  // Remove any existing listeners to prevent duplicates
  myEmitter.removeAllListeners(EventName.ACCESS_BLOCKED_WEBSITES);

  myEmitter.on(EventName.ACCESS_BLOCKED_WEBSITES, async (email: string) => {
    try {
      const user: UserType[] = await (await dbObj)
        .select()
        .from(users)
        .where(eq(users.email, email)) as unknown as UserType[];

      if (user.length > 0 && user[0].organizationId) {
        const organizationId = user[0].organizationId;

        const managers: UserType[] = await (await dbObj)
          .select()
          .from(users)
          .where(and(eq(users.organizationId, organizationId), eq(users.role, 'manager'))) as unknown as UserType[];

        if (managers.length > 0) {
          const message = `${user[0].name} (${email}) tried to access a blocked website.`;

          for (const manager of managers) {
            // Check if a similar notification already exists
            const existingNotifications = await (await dbObj)
              .select()
              .from(notifications)
              .where(
                and(
                  eq(notifications.userId, manager.id),
                  eq(notifications.message, message),
                  eq(notifications.unread, true)
                )
              );

            if (existingNotifications.length === 0) {
              const newNotification: NewNotification = {
                message: message,
                unread: true,
                userId: manager.id,
                createdAt: new Date(),
                updatedAt: new Date(),
              };

              await (await dbObj).insert(notifications).values(newNotification);
              console.log('Notification saved for manager:', manager.name);
            } else {
              console.log('Similar unread notification already exists for manager:', manager.name);
            }
          }
        } else {
          console.log("No manager found for the organization");
        }
      } else {
        console.log(`No user found with email ${email} or organizationId is null`);
      }
    } catch (error) {
      console.error("Error handling blocked website event:", error);
    }
  });
};
import {
  mysqlTable,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";
import { users } from "./User";

export const notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  message: text("message"),
  unread: boolean("unread").$default(() => true),
  userId: varchar("userId", { length: 256 }).references(() => users.id),
  createdAt: timestamp("createdAt").$default(() => new Date()),
  updatedAt: timestamp("updatedAt")
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
});

export type NotificationType = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

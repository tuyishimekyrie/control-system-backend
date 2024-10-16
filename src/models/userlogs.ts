import {
  date,
  mysqlTable,
  text,
  time,
  varchar,
  timestamp,
} from "drizzle-orm/mysql-core";
import { organizations } from "./organizations";
import { schools } from "./schools";
import { parents } from "./parents";

export const userLogs = mysqlTable("Logs", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email"),
  organizationId: varchar("organizationId", { length: 256 }).references(
    () => organizations.id,
    {
      onDelete: "cascade",
    },
  ),
  parentId: varchar("parentId", { length: 256 }).references(() => parents.id, {
    onDelete: "cascade",
  }),
  schoolId: varchar("schoolId", { length: 256 }).references(() => schools.id, {
    onDelete: "cascade",
  }),
  url: text("url"),
  duration: time("duration"),
  date: date("date").$default(() => new Date()),
});

export type UserLogType = typeof userLogs.$inferSelect;
export type NewUserLog = typeof userLogs.$inferInsert;

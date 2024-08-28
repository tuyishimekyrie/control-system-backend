import { date, mysqlTable, text, time, varchar } from "drizzle-orm/mysql-core";

export const userLogs = mysqlTable("Logs", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email"),
  organizationId: varchar("organizationId", { length: 256 }),
  url: text("url"),
  duration: time("duration"),
  date: date("date").$default(() => new Date()),
});

export type UserLogType = typeof userLogs.$inferSelect;
export type NewUserLog = typeof userLogs.$inferInsert;

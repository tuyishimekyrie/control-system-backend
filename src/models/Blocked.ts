import { mysqlTable, varchar, text, timestamp } from "drizzle-orm/mysql-core";
import { organizations } from "./organizations";
import { schools } from "./schools";
import { parents } from "./parents";

export const blockedWebsites = mysqlTable("blockedWebsite", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  url: text("url"),
  organizationId: varchar("organizationId", { length: 256 }).references(
    () => organizations.id,
    { onDelete: "cascade" },
  ),
  parentId: varchar("parentId", { length: 256 }).references(() => parents.id, {
    onDelete: "cascade",
  }),
  schoolId: varchar("schoolId", { length: 256 }).references(() => schools.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("createdAt").$default(() => new Date()),
  updatedAt: timestamp("updatedAt")
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
});

export type BlockedWebsiteType = typeof blockedWebsites.$inferSelect;
export type NewBlockedWebsite = typeof blockedWebsites.$inferInsert;

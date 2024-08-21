import { mysqlTable, varchar, text, timestamp } from "drizzle-orm/mysql-core";

export const blockedWebsites = mysqlTable("blockedWebsite", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  url: text("url"),
  createdAt: timestamp("createdAt").$default(() => new Date()),
  updatedAt: timestamp("updatedAt")
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
});

export type BlockedWebsiteType = typeof blockedWebsites.$inferSelect; // Type when queried
export type NewBlockedWebsite = typeof blockedWebsites.$inferInsert; // Type for inserting new blocked website

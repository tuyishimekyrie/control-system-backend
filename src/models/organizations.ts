import { mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const organizations = mysqlTable("organizations", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).unique(),
  createdAt: timestamp("createdAt").$default(() => new Date()),
  updatedAt: timestamp("updatedAt")
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
});

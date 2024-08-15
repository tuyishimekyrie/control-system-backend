import { mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

export const URLFilter = mysqlTable("URLFilter", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  url: varchar("name", { length: 256 }).notNull().unique(),
});


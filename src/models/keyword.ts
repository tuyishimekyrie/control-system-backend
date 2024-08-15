import { mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

export const Keyword = mysqlTable("Keyword", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  keyword: varchar("name", { length: 256 }).notNull().unique(),
});


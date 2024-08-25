import { mysqlTable, serial, text, varchar } from "drizzle-orm/mysql-core";
import { Category } from "./category";

export const Keyword = mysqlTable("Keyword", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  keyword: varchar("name", { length: 256 }).notNull().unique(),
  categoryId: serial("categoryId").references(() => Category.id),
});

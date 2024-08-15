import {
    json,
    mysqlTable,
    varchar
} from "drizzle-orm/mysql-core";

export const Category = mysqlTable("Category", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 256 }).notNull().unique(),
  keywords: json("keywords").default([]), // Use JSON type to store an array of keyword IDs
});

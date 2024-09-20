import {
  mysqlTable,
  text,
  timestamp,
  varchar,
  int,
} from "drizzle-orm/mysql-core";

export const schools = mysqlTable("schools", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).unique(),
  maxUsers: int("maxUsers").$default(() => 0),
  createdAt: timestamp("createdAt").$default(() => new Date()),
  updatedAt: timestamp("updatedAt")
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
});

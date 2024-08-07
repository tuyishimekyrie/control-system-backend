import {
  date,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const UserRole = mysqlEnum('role', ['user', 'manage']);

export const users = mysqlTable("user", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email"),
  image: text("image"),
  password: text("password"),
   role: UserRole,
  createdAt: timestamp("createdAt").$default(() => new Date()),
  updatedAt: timestamp("updatedAt")
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
});

export type UserType = typeof users.$inferSelect; // Type when queried
export type NewUser = typeof users.$inferInsert; // Type for inserting new user

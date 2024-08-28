import {
  boolean,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { organizations } from "./organizations";

export const UserRole = mysqlEnum("role", ["user", "manager", "admin"]);

export const users = mysqlTable("user", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  image: text("image"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  email: text("email"),
  password: text("password"),
  role: UserRole,
  organizationId: varchar("organizationId", { length: 256 }).references(
    () => organizations.id,
    { onDelete: "cascade" },
  ),
  isSubscribed: boolean("isSubscribed").$default(() => false),
  createdAt: timestamp("createdAt").$default(() => new Date()),
  updatedAt: timestamp("updatedAt")
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
});

export type UserType = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

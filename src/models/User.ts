import {
  boolean,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { organizations } from "./organizations";
import { schools } from "./schools";
import { parents } from "./parents";

export const UserRole = mysqlEnum("role", [
  "user",
  "manager",
  "parent",
  "school",
  "admin",
]);

export const users = mysqlTable("user", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  image: text("image"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  macAddress: varchar("macAddress", { length: 45 }),
  email: text("email"),
  password: text("password"),
  role: UserRole,
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
  isSubscribed: boolean("isSubscribed").$default(() => false),
  createdAt: timestamp("createdAt").$default(() => new Date()),
  updatedAt: timestamp("updatedAt")
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
});

export type UserType = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

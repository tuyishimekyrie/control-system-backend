import { mysqlTable } from "drizzle-orm/mysql-core";
import {
  timestamp,
  text,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"), 
});


export type UserType = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type
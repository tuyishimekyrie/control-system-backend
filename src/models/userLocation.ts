import { mysqlTable, float, varchar, timestamp } from "drizzle-orm/mysql-core";
import { users } from "./User";

export const userLocations = mysqlTable("user_locations", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("userId", { length: 256 }).references(() => users.id, {
    onDelete: "cascade",
  }),
  latitude: float("latitude"),
  longitude: float("longitude"),
  recordedAt: timestamp("recordedAt").$default(() => new Date()),
});

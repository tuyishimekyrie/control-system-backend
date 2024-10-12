import {
  mysqlTable,
  varchar,
  decimal,
  int,
  timestamp,
} from "drizzle-orm/mysql-core";
import { organizations } from "./organizations";

// Define the geofence table schema
export const geofence = mysqlTable("geofences", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  latitude: decimal("latitude", { precision: 9, scale: 6 }).notNull(), // Proper latitude definition
  longitude: decimal("longitude", { precision: 9, scale: 6 }).notNull(), // Proper longitude definition
  radius: int("radius").notNull(), // Integer for radius in meters
  organizationId: varchar("organization_id", { length: 256 })
    .notNull()
    .references(() => organizations.id), // Referencing the organizations table

  createdAt: timestamp("created_at").defaultNow().notNull(), // Timestamp for createdAt
});

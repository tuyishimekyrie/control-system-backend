import {
  int,
  mysqlEnum,
  mysqlTable,
  uniqueIndex,
  varchar,
  serial,
} from "drizzle-orm/mysql-core";
import { countries } from "./Countries";

export const cities = mysqlTable("cities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  countryId: int("country_id").references(() => countries.id),
  popularity: mysqlEnum("popularity", ["unknown", "known", "popular"]),
});

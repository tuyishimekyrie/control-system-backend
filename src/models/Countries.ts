import {
  int,
  mysqlEnum,
  mysqlTable,
  uniqueIndex,
  varchar,
  serial,
} from "drizzle-orm/mysql-core";

// declaring enum in database
export const countries = mysqlTable(
  "countries",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
  },
  (countries) => ({
    nameIndex: uniqueIndex("name_idx").on(countries.name),
  })
);



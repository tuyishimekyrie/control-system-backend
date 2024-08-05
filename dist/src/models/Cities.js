"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cities = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const Countries_1 = require("./Countries");
exports.cities = (0, mysql_core_1.mysqlTable)("cities", {
    id: (0, mysql_core_1.serial)("id").primaryKey(),
    name: (0, mysql_core_1.varchar)("name", { length: 256 }),
    countryId: (0, mysql_core_1.int)("country_id").references(() => Countries_1.countries.id),
    popularity: (0, mysql_core_1.mysqlEnum)("popularity", ["unknown", "known", "popular"]),
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countries = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
// declaring enum in database
exports.countries = (0, mysql_core_1.mysqlTable)("countries", {
    id: (0, mysql_core_1.serial)("id").primaryKey(),
    name: (0, mysql_core_1.varchar)("name", { length: 256 }),
}, (countries) => ({
    nameIndex: (0, mysql_core_1.uniqueIndex)("name_idx").on(countries.name),
}));

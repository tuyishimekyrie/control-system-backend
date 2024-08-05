"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const mysql_core_2 = require("drizzle-orm/mysql-core");
exports.users = (0, mysql_core_1.mysqlTable)("user", {
    id: (0, mysql_core_2.text)("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: (0, mysql_core_2.text)("name"),
    email: (0, mysql_core_2.text)("email"),
    emailVerified: (0, mysql_core_2.timestamp)("emailVerified", { mode: "date" }),
    image: (0, mysql_core_2.text)("image"),
    password: (0, mysql_core_2.text)("password"),
});

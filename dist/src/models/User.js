"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.UserRole = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
exports.UserRole = (0, mysql_core_1.mysqlEnum)('role', ['user', 'manager']);
exports.users = (0, mysql_core_1.mysqlTable)("user", {
    id: (0, mysql_core_1.varchar)("id", { length: 256 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: (0, mysql_core_1.text)("name"),
    email: (0, mysql_core_1.text)("email"),
    image: (0, mysql_core_1.text)("image"),
    password: (0, mysql_core_1.text)("password"),
    role: exports.UserRole,
    createdAt: (0, mysql_core_1.timestamp)("createdAt").$default(() => new Date()),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt")
        .$default(() => new Date())
        .$onUpdate(() => new Date()),
});

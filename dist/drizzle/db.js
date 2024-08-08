"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbObj = void 0;
// src/drizzle/db.ts
const mysql2_1 = require("drizzle-orm/mysql2");
const promise_1 = __importDefault(require("mysql2/promise"));
const Logger_1 = require("../src/utils/Logger");
async function createDbConnection() {
    try {
        const connection = await promise_1.default.createConnection({
            // Cloud
            host: "control-system-control-system.l.aivencloud.com",
            user: "avnadmin",
            password: "AVNS_QtiiL0AB5SDx8Hdibb3",
            database: "defaultdb",
            port: 26697,
            // Locally
            // host: "127.0.0.1",
            // user: "root",
            // password:"kyrie",
            // database: "controlsystem"
        });
        Logger_1.logger.info("Database connected successfully");
        return (0, mysql2_1.drizzle)(connection);
    }
    catch (error) {
        Logger_1.logger.error("Database connection failed", error);
        throw error;
    }
}
// Export a promise that resolves to the DB instance
exports.dbObj = createDbConnection();

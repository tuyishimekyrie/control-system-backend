// src/drizzle/db.ts
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { logger } from "../src/utils/Logger";

async function createDbConnection() {
  try {
    const connection = await mysql.createConnection({
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

    logger.info("Database connected successfully");

    return drizzle(connection);
  } catch (error) {
    logger.error("Database connection failed", error);
    throw error;
  }
}

// Export a promise that resolves to the DB instance
export const dbPromise = createDbConnection();

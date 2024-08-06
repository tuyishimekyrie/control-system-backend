import dotenv from 'dotenv';
import express from "express";
import { dbObj } from "../drizzle/db";
import router from "./routes";
import { logger } from "./utils/Logger";

dotenv.config();

const app = express();
const port = process.env.port ;

app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, async () => {
  try {
    const db = await dbObj;
    logger.info("Database connection established");
  } catch (error) {
    logger.error("Failed to connect to the database");
  }
  logger.info(`Server running at http://localhost:${port}`);
});

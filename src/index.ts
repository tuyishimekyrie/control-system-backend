import express from "express";
import { dbPromise } from "../drizzle/db";
import router from "./routes";
import dotenv from 'dotenv';

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
    const db = await dbPromise;
    console.log("Database connection established");
  } catch (error) {
    console.error("Failed to connect to the database");
  }
  console.log(`Server running at http://localhost:${port}`);
});

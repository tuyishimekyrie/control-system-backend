// src/index.ts
import express from "express";
import { dbPromise } from "../drizzle/db";

const app = express();
const port = 3000;

app.use(express.json());

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

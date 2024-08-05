"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const db_1 = require("../drizzle/db");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("hello world");
});
app.listen(port, async () => {
    try {
        const db = await db_1.dbPromise;
        console.log("Database connection established");
    }
    catch (error) {
        console.error("Failed to connect to the database");
    }
    console.log(`Server running at http://localhost:${port}`);
});

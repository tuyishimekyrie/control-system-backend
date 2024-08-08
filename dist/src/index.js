"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const db_1 = require("../drizzle/db");
const routes_1 = __importDefault(require("./routes"));
const Logger_1 = require("./utils/Logger");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.port;
app.use(express_1.default.json());
app.use(routes_1.default);
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send("hello world");
});
app.listen(port, async () => {
    try {
        const db = await db_1.dbObj;
        Logger_1.logger.info("Database connection established");
    }
    catch (error) {
        Logger_1.logger.error("Failed to connect to the database");
    }
    Logger_1.logger.info(`Server running at http://localhost:${port}`);
});

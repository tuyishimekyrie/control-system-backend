"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
const db_1 = require("../../drizzle/db");
const models_1 = require("../models");
const validations_1 = require("../validations");
const Logger_1 = require("../utils/Logger");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const loginController = async (req, res) => {
    try {
        const body = req.body;
        const parseSchema = validations_1.loginSchema.safeParse(body);
        if (!parseSchema.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: parseSchema.error.errors,
            });
        }
        const usersResult = await (await db_1.dbObj)
            .select()
            .from(models_1.users)
            .where((0, drizzle_orm_1.eq)(models_1.users.email, body.email))
            .limit(1);
        const dbUser = usersResult[0];
        Logger_1.logger.info(dbUser);
        if (!dbUser) {
            return res.status(400).send(`User with email ${body.email} not found`);
        }
        const { password } = body;
        const passwordMatch = await bcryptjs_1.default.compare(password, dbUser.password);
        if (passwordMatch) {
            // Create JWT token
            const token = jsonwebtoken_1.default.sign({ email: dbUser.email, name: dbUser.name }, JWT_SECRET, {
                expiresIn: "1h",
            });
            // Set token in header
            res.setHeader("Authorization", `Bearer ${token}`);
            // Set token in cookie
            res.cookie("authToken", token, {
                httpOnly: true, // Helps prevent XSS attacks
                secure: process.env.NODE_ENV === "production", // Only set the cookie over HTTPS in production
                maxAge: 3600000, // 1 hour in milliseconds
            });
            res.status(200).send(`User logged in successfully, token: ${token}`);
        }
        else {
            res.status(400).send(`Invalid password`);
        }
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({
                message: "Invalid data",
                errors: error.errors,
            });
        }
        else if (error instanceof Error) {
            res.status(500).send(`Internal Server Error: ${error.message}`);
        }
        else {
            res.status(500).send("Internal Server Error");
        }
    }
};
exports.loginController = loginController;

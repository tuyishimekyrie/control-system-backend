"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeMiddleware = exports.authenticateMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const db_1 = require("../../drizzle/db");
const drizzle_orm_1 = require("drizzle-orm");
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const authenticateMiddleware = async (req, res, next) => {
    var _a;
    try {
        // Extract token from header or cookie
        const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Fetch user from database
        const usersResult = await (await db_1.dbObj)
            .select()
            .from(models_1.users)
            .where((0, drizzle_orm_1.eq)(models_1.users.email, decoded.email))
            .limit(1);
        const dbUser = usersResult[0];
        if (!dbUser) {
            return res.status(401).json({ message: "User not found" });
        }
        // Attach user info to request
        req.user = {
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role, // Assuming `role` field exists
        };
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authenticateMiddleware = authenticateMiddleware;
// Middleware to check specific roles
const authorizeMiddleware = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient role" });
        }
        next();
    };
};
exports.authorizeMiddleware = authorizeMiddleware;

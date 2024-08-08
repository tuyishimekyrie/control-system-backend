"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const db_1 = require("../../drizzle/db");
const models_1 = require("../models");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserService {
    async hashPassword(password) {
        return bcryptjs_1.default.hash(password, 10); // Hash the password with a salt round of 10
    }
    async registerUser(name, email, image, password) {
        try {
            // Hash the password
            const hashedPassword = await this.hashPassword(password);
            // Insert new user into the database
            await (await db_1.dbObj).insert(models_1.users).values({
                name,
                email,
                image,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
                role: "user"
            });
            console.log("User registered successfully");
        }
        catch (error) {
            console.error(`Error registering user: ${error.message}`);
            throw error;
        }
    }
}
exports.UserService = UserService;

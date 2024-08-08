"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
const db_1 = require("../../drizzle/db");
const models_1 = require("../models");
const services_1 = require("../services");
const validations_1 = require("../validations");
const userService = new services_1.UserService();
const registerController = async (req, res) => {
    try {
        const body = req.body;
        const parseSchema = validations_1.UserSchema.safeParse(body);
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
        let dbUser = usersResult[0];
        if (dbUser)
            return res
                .status(400)
                .send(`User with email ${body.email} already exists`);
        const { name, email, image, password } = body;
        await userService.registerUser(name, email, image, password);
        res.status(201).send(`User registered successfully`);
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
exports.registerController = registerController;

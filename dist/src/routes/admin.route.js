"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticateToken_1 = require("../middleware/authenticateToken");
const controllers_1 = require("../controllers");
const adminRoute = express_1.default.Router();
adminRoute.use(authenticateToken_1.authenticateMiddleware); // Apply authentication middleware
adminRoute.get("/admin/dashboard", (0, authenticateToken_1.authorizeMiddleware)(["manager"]), controllers_1.adminController); // Apply role authorization middleware
exports.default = adminRoute;

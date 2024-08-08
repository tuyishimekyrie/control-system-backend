"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
(0, winston_1.addColors)({
    info: "green",
    warn: "yellow",
    error: "red",
    debug: "blue",
});
exports.logger = (0, winston_1.createLogger)({
    transports: [new winston_1.transports.Console()],
    format: winston_1.format.combine(winston_1.format.colorize({ all: true }), winston_1.format.prettyPrint({ colorize: true }), winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm" }), winston_1.format.printf(({ timestamp, level, message, service }) => {
        return `\x1b[93m [${timestamp}] \x1b[36m ${service} ${level}: ${message}\x1b[0m`;
    })),
    defaultMeta: {
        service: "API",
    },
});

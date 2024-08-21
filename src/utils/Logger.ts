import { createLogger, transports, format, addColors } from "winston";
addColors({
  info: "green",
  warn: "yellow",
  error: "red",
  debug: "blue",
});

export const logger = createLogger({
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize({ all: true }),
    format.prettyPrint({ colorize: true }),
    format.timestamp({ format: "YYYY-MM-DD HH:mm" }),
    format.printf(({ timestamp, level, message, service }) => {
      return `\x1b[93m [${timestamp}] \x1b[36m ${service} ${level}: ${message}\x1b[0m`;
    }),
  ),
  defaultMeta: {
    service: "API",
  },
});

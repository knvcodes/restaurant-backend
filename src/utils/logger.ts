import pino, { LoggerOptions, Logger, LogFn } from "pino";

// Ensure logs directory exists
import fs from "fs";
import path from "path";

const logDir = process.env.LOGS_DIR || path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Your original options — unchanged
const options: LoggerOptions = {
  level: process.env.LOG_LEVEL || "info",

  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
    },
  },

  base: { pid: false },
};

console.info("options:===>", options);

// Pretty console logger (your existing feature)
const consoleLogger: Logger = pino(options);

// File logger for errors only
const fileLogger: Logger = pino(
  {
    level: "error",
    base: { pid: false },
  },
  pino.destination({
    dest: path.join(logDir, "error.log"),
    append: true,
    sync: true,
  }),
);

// Combined logger that writes to both
const logger: Logger = Object.create(consoleLogger) as Logger;

logger.error = ((...args: Parameters<LogFn>): void => {
  consoleLogger.error(...args);
  fileLogger.error(...args);
}) as LogFn;

logger.fatal = ((...args: Parameters<LogFn>): void => {
  consoleLogger.fatal(...args);
  fileLogger.fatal(...args);
}) as LogFn;

export default logger;

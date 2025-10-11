import pino, { LoggerOptions, Logger } from "pino";
import path from "path";

const getCallerInfo = () => {
  const stack = new Error().stack;
  if (!stack) return {};

  const lines = stack
    .split("\n")
    .filter(l => l.includes(process.cwd())); // only your project files

  const callerLine = lines[1] || lines[0];
  const match = callerLine.match(/\((.*):(\d+):(\d+)\)/);
  if (!match) return {};

  return {
    file: path.basename(match[1]),
    line: match[2],
  };
};


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

  /**
   * mixin runs BEFORE every log.
   * Anything returned is merged into the log object.
   */
  // mixin() {
  //   return getCallerInfo();
  // },
};

const logger: Logger = pino(options);

export default logger;

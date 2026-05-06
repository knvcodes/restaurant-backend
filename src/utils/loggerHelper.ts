import path from "path";

/**
 * Logs a message with file name and line number.
 * Accepts any number of arguments of any type, like console.log.
 */
export function withLocation(...args: any[]): string {
  const stack = new Error().stack;
  let location = "[unknown:0]";

  if (stack) {
    const lines = stack
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => !l.includes("node_modules"));

    // Skip the first line ("Error") and helper frames
    const callerLine = lines[2] || lines[1] || lines[0];

    const match = callerLine.match(/\((.*):(\d+):(\d+)\)/);
    if (match) {
      const file = path.basename(match[1]);
      const line = match[2];
      location = `[${file}:${line}]`;
    }
  }

  // Combine all arguments like console.log does
  const message = args
    .map((arg) => {
      // Handle Error instances explicitly
      if (arg instanceof Error) {
        return arg.stack || arg.message || String(arg);
      }

      if (typeof arg === "object") {
        try {
          console.log("here===>", arg);
          return JSON.stringify(arg);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    })
    .join(" ");

  return `${location} ${message}`;
}

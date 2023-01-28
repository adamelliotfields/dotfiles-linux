import { EOL } from "std/node/os.ts";
import * as log from "std/log/mod.ts";

/**
 * Sets up our custom loggers.
 * The font colors are:
 * DEBUG: white
 * INFO: blue
 * WARNING: yellow
 * ERROR: red
 * CRITICAL: bold red
 * @see {@link https://deno.land/std/fmt/colors.ts}
 * @see {@linkcode log.LogConfig}
 */
log.setup({
  handlers: {
    /* The `levelName` is the minimum level to log.
     * The loggers always return their message, even if they don't log anything
     * due to level. */
    console: new log.handlers.ConsoleHandler("DEBUG", { formatter }),
  },
  loggers: {
    /* The default logger is the `log` module we imported.
     * Note that EVERY handler at the log level or higher will be called, so be
     * careful if you add multiple console handlers to the same logger. */
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});

export default log.getLogger("default");

/**
 * Formats an error object for logging.
 * The string we receive has the `error.message` on the first line followed be
 * the `error.trace`.
 */
function formatter({ msg }: log.LogRecord): string {
  const [first, ...rest] = msg.split(EOL);
  // the `^` matches the beginning of the line and the `\s+` matches any whitespace
  const regexp = new RegExp(`^\\s+`);
  const message = first.startsWith("Error: ") ? first.slice(7) : first;
  const stack = rest.map((line) => line.replace(regexp, "")).join(EOL);

  // we don't want to add an extra newline if there is no stack trace
  return stack.length > 0 ? `${message}${EOL}${stack}` : message;
}

// logger.debug("DEBUG");
// logger.info("💁 INFO");
// logger.warning("❗️ WARNING");
// logger.error(new Error("🚨 ERROR"));
// logger.critical(new Error("💀 CRITICAL"));

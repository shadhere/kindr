import buildDevLogger from "./dev-logger";
import buildProdLogger from "./prod-logger";
import { Logger } from "winston"; // Assuming Logger type is from Winston

let logger: Logger; // Declare logger with Logger type

if (process.env.NODE_ENV !== "production") {
  logger = buildDevLogger();
} else {
  logger = buildProdLogger();
}

export default logger;

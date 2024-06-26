import { format, createLogger, transports } from "winston";
const { timestamp, printf, combine, errors } = format;

const buildProdLogger = () => {
  return createLogger({
    format: combine(timestamp(), errors({ stack: true }), format.json()),
    defaultMeta: { service: "user-service" },
    transports: [
      new transports.Console(),
      new transports.File({ filename: "logs/error.log", level: "error" }),
      new transports.File({ filename: "logs/combined.log" }),
    ],
  });
};

export default buildProdLogger;

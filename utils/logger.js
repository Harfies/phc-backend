// Winston logger configuration for application logging

const winston = require("winston");

// Create logger instance
const logger = winston.createLogger({
  // Minimum level to log
  level: "info",

  // Log format
  format: winston.format.combine(
    // Add timestamp
    winston.format.timestamp(),

    // Format log output
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    }),
  ),

  // Where logs should go
  transports: [
    // Log to console
    new winston.transports.Console(),

    // Store errors in file
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    // Store all logs
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

module.exports = logger;

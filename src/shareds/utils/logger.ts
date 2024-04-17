import { existsSync, mkdirSync } from 'fs';
import { LOG_DIR } from 'shareds/configs/const.config';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

if (LOG_DIR && LOG_DIR.trim() !== '' && !existsSync(LOG_DIR)) {
  mkdirSync(LOG_DIR);
}

const loggerFormat = winston.format.combine(
  winston.format.printf(({ level, message, timestamp, stack }) => {
    return `[${timestamp}] [${level.toUpperCase()}] ${stack || message}`;
  }),
);

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    loggerFormat,
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize({ all: true })),
    }),
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: LOG_DIR + '/errors',
      filename: `%DATE%.log`,
      maxFiles: 30,
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
    new winstonDaily({
      level: 'warn',
      datePattern: 'YYYY-MM-DD',
      dirname: LOG_DIR + '/warns',
      filename: `%DATE%.log`,
      maxFiles: 30,
      json: false,
      zippedArchive: true,
    }),
    new winstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: LOG_DIR + '/infos',
      filename: `%DATE%.log`,
      maxFiles: 30,
      json: false,
      zippedArchive: true,
    }),
  ],
});

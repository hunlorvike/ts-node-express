import winston from 'winston';

const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.printf(({ level, message, timestamp, stack }) => {
        return `[${timestamp}] ${level}: ${stack || message}`;
    }),
);

const fileFormat = winston.format.combine(
    winston.format.printf(({ level, message, timestamp, stack }) => {
        return `[${timestamp}] ${level}: ${stack || message}`;
    }),
);

export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
    ),
    transports: [
        new winston.transports.Console({
            format: consoleFormat,
        }),
        new winston.transports.File({
            filename: './logs/error.log',
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5,
            tailable: true,
            format: fileFormat,
        }),
        new winston.transports.File({
            filename: './logs/combined.log',
            maxsize: 5242880,
            maxFiles: 5,
            tailable: true,
            format: fileFormat,
        }),
    ],
});

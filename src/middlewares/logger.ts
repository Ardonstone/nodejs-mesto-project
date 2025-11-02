import winston from 'winston';
import expressWinston from 'express-winston';
import path from 'path';

const logFormat = winston.format.combine(winston.format.timestamp(), winston.format.json());

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: path.join('logs', 'request.log') }),
  ],
  format: logFormat,
  meta: true,
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: path.join('logs', 'error.log') }),
  ],
  format: logFormat,
  meta: true,
});

export { requestLogger, errorLogger };
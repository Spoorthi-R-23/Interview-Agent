import winston from 'winston';

const { combine, timestamp, printf, colorize, splat } = winston.format;

const logFormat = printf(({ level, message, timestamp: ts, ...meta }) => {
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `${ts} [${level}]: ${message}${metaStr}`;
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(timestamp(), splat(), logFormat),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), splat(), logFormat)
    })
  ]
});

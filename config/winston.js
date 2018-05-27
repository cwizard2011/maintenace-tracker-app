import winston from 'winston';
import fs from 'fs';
import 'winston-daily-rotate-file';

const env = process.env.NODE_ENV || 'development';
const logDir = 'log';
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info',
    }),
    new (winston.transports.DailyRotateFile)({
      filename: `${logDir}/-results.log`,
      timestamp: tsFormat,
      datePattern: 'yyyy-MM-dd',
      prepend: true,
      level: env === 'development' ? 'verbose' : 'info',
      json: true,
    }),
  ],
  exitOnError: false,
});
logger.stream = {
  write: (message) => {
    /**
     *use the 'info' log level so the output will be picked up by both
     transports (file and console)
     */
    logger.info(message);
  },
};
logger.debug('Debugging info');
logger.verbose('Verbose info');
logger.info('Hello world');
logger.warn('Warning message');
logger.error('Error info');

export default logger;

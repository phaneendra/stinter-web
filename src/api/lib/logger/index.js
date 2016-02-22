import winston from 'winston';

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: true,
      level: 'debug',
      handleExceptions: true,
      json: false
    })
  ],
  exitOnError: false
});

logger.stream = {
  write: function (message, encoding) {
    logger.info(message);
  }
};

export default function getLogger () {
  // var path = module.filename.split('/').slice(-2).join('/'); // using filename in log statements
  return logger;
}

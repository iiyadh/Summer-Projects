const logger = require('../lib/logger');

function notFound(req, res, next) {
  res.status(404).json({ message: 'Route not found' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;

  logger.error(err, 'Unhandled error');

  res.status(status).json({
    message: err.message || 'Internal server error',
  });
}

module.exports = {
  notFound,
  errorHandler,
};

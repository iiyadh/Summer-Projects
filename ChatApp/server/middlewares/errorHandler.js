function notFound(req, res, next) {
  res.status(404).json({ message: 'Route not found' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Keep server-side visibility in development
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    message: err.message || 'Internal server error',
    ...(isProd ? {} : { stack: err.stack }),
  });
}

module.exports = {
  notFound,
  errorHandler,
};

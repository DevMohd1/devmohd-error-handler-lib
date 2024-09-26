const { logErrorWithRateLimiting, logErrorToSentry, logErrorToDatadog } = require('./logger');
const { ValidationError, DatabaseError, UnauthorizedError, NotFoundError } = require('./customErrors');

function errorHandler(err, req, res, next, options = {}) {
  // Extract the preferred language from the 'Accept-Language' header, default to 'en'
  const lang = req.headers['accept-language'] ? req.headers['accept-language'].split(',')[0] : 'en';
  const language = ['en', 'ar'].includes(lang) ? lang : 'en';  // Support only 'en' and 'ar'

  // Log error with Winston and optionally to Sentry and Datadog
  logErrorWithRateLimiting(err);  // Log error using rate limiting
  logErrorToSentry(err);  // Log to Sentry (if configured)
  logErrorToDatadog(err);  // Log to Datadog (if configured)

  // Default error response
  const defaultResponse = {
    status: err.statusCode || 500,
    message: err.message,
  };

  // In production, return a generic error message
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    return res.status(defaultResponse.status).json({
      status: err.severity || 'error',
      message: 'An unexpected error occurred, please try again later.',
    });
  }

  // In development, send detailed error information
  return res.status(defaultResponse.status).json({
    status: err.severity || 'error',
    message: defaultResponse.message,  // Localized or custom message
    stack: err.stack,  // Stack trace for debugging
    meta: err.meta,  // Additional metadata if available
  });
}

module.exports = errorHandler;

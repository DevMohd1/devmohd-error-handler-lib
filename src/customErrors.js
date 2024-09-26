const { localizeMessage } = require('./localization');  // Import localization utility

// Base AppError class with custom category and severity
class AppError extends Error {
  constructor(messageKey, statusCode, lang = 'en', customMessage = null, category = 'general', severity = 'error', meta = {}) {
    const originalMessage = localizeMessage(messageKey, 'en');  // Get the original English message for the stack trace
    const localizedMessage = localizeMessage(messageKey, lang);  // Get the localized message for the response
    const finalMessage = customMessage || localizedMessage;  // Use custom message if provided, otherwise use localized message
    super(originalMessage);  // Use the English message for the stack trace
    this.localizedMessage = finalMessage;  // Store the final message (either custom or localized)
    this.statusCode = statusCode;
    this.category = category;  // Add the error category (default is 'general')
    this.severity = severity;  // Add severity level (default is 'error')
    this.meta = meta;

    // Capture the stack trace using the original English message
    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation Error (400)
class ValidationError extends AppError {
  constructor(lang = 'en', customMessage = null, meta = {}) {
    super('VALIDATION_FAILED', 400, lang, customMessage, 'validation', 'warning', meta);  // Define category and severity
  }
}

// Database Error (500)
class DatabaseError extends AppError {
  constructor(lang = 'en', customMessage = null, meta = {}) {
    super('DATABASE_ERROR', 500, lang, customMessage, 'database', 'critical', meta);  // Define category and severity
  }
}

// Unauthorized Error (401)
class UnauthorizedError extends AppError {
  constructor(lang = 'en', customMessage = null, meta = {}) {
    super('UNAUTHORIZED', 401, lang, customMessage, 'authorization', 'warning', meta);  // Define category and severity
  }
}

// Not Found Error (404)
class NotFoundError extends AppError {
  constructor(lang = 'en', customMessage = null, meta = {}) {
    super('NOT_FOUND', 404, lang, customMessage, 'resource', 'error', meta);  // Define category and severity
  }
}

// Export the custom error classes
module.exports = {
  ValidationError,
  DatabaseError,
  UnauthorizedError,
  NotFoundError,
};

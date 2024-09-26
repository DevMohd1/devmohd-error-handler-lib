class AppError extends Error {
    constructor(message, statusCode, isOperational = true, severity = 'error', meta = {}) {
      super(message);
      this.message = message;
      this.statusCode = statusCode;
      this.severity = severity; // e.g., 'info', 'warning', 'critical'
      this.isOperational = isOperational;
      this.meta = meta;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;
  
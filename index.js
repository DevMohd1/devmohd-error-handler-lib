const { logErrorWithLevel, logErrorWithRateLimiting, logErrorWithContext } = require('./src/logger');
const AppError = require('./src/AppError');
const errorHandler = require('./src/errorHandler');
const catchAsync = require('./src/catchAsync');
const httpErrors = require('./src/httpErrors');
const { NotFoundError, ValidationError, DatabaseError, UnauthorizedError,ExternalServiceError } = require('./src/customErrors'); // Ensure this line is added and correct
require('dotenv').config();
 

module.exports = {
  AppError,
  errorHandler,
  catchAsync,
  httpErrors,
  ValidationError,
  DatabaseError,
  ExternalServiceError,
  NotFoundError,
  UnauthorizedError,
  logErrorWithLevel,
  logErrorWithRateLimiting,
  logErrorWithContext,
};

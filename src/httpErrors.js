const AppError = require('./AppError');

function badRequest(message = 'Bad Request', meta = {}) {
  return new AppError(message, 400, true, 'error', meta);
}

function unauthorized(message = 'Unauthorized', meta = {}) {
  return new AppError(message, 401, true, 'error', meta);
}

function notFound(message = 'Not Found', meta = {}) {
  return new AppError(message, 404, true, 'error', meta);
}

function internalServerError(message = 'Internal Server Error', meta = {}) {
  return new AppError(message, 500, true, 'error', meta);
}

module.exports = {
  badRequest,
  unauthorized,
  notFound,
  internalServerError,
};

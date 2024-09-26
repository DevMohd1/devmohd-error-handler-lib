const winston = require('winston');

// Load environment variables for optional logging
const logFilePath = process.env.LOG_FILE_PATH || null;  // Log file path from .env or null
const logStackTrace = process.env.LOG_STACK_TRACE === 'true';  // Log stack trace if true

// Initialize Sentry only if the DSN is provided
let Sentry;
if (process.env.SENTRY_DSN) {
  Sentry = require('@sentry/node');
  Sentry.init({ dsn: process.env.SENTRY_DSN });
  console.log('Sentry initialized');
}

// Initialize Datadog API Client only if the API key is provided
let logsApi;
if (process.env.DATADOG_API_KEY) {
  const { v2: datadog } = require('@datadog/datadog-api-client');
  const configuration = datadog.createConfiguration({
    authMethods: {
      apiKeyAuth: process.env.DATADOG_API_KEY,
    },
  });
  logsApi = new datadog.LogsApi(configuration);
  console.log('Datadog initialized');
}

// Function to log errors to Sentry (only if Sentry is initialized)
function logErrorToSentry(err) {
  if (Sentry) {
    Sentry.captureException(err);
    console.log('Error sent to Sentry:', err.message);
  } else {
    console.log('Sentry not initialized, skipping error log.');
  }
}

// Function to log errors to Datadog (only if Datadog is initialized)
function logErrorToDatadog(err) {
  if (logsApi) {
    const params = {
      body: [
        {
          message: `Error: ${err.message}`,
          ddtags: 'env:production',
          level: 'error',
        },
      ],
    };

    logsApi.submitLog(params)
      .then(() => console.log('Error logged to Datadog:', err.message))
      .catch((err) => console.error('Failed to log to Datadog:', err));
  } else {
    console.log('Datadog not initialized, skipping error log.');
  }
}

// Define Winston transports (console is always active, file is optional)
const transports = [
  new winston.transports.Console(),  // Always log to console
];

// Add file transport only if logFilePath is specified
if (logFilePath) {
  transports.push(new winston.transports.File({ filename: logFilePath }));
  console.log(`Logging to file: ${logFilePath}`);  // Debugging to confirm file path recognition
} else {
  console.log('No log file path provided. Logging only to console.');  // If no file path is set, log to console only
}

// Create a Winston logger instance with console and file transports
const logger = winston.createLogger({
  level: 'error',  // Log errors only
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}${logStackTrace && stack ? `\nStack: ${stack}` : ''}`;
    })
  ),
  transports: transports,  // Log to console and file (if set)
});

// Implement rate limiting to avoid duplicate logs
const errorCache = new Map();
const logInterval = 60000;  // 1 minute between duplicate logs

// Function to log errors with rate limiting
function logErrorWithRateLimiting(err, level = 'error') {
  const errorKey = err.message;
  const now = Date.now();

  if (errorCache.has(errorKey)) {
    const lastLogTime = errorCache.get(errorKey);
    if (now - lastLogTime < logInterval) {
      console.log(`[Rate-limited] Skipping log for error: ${err.message}`);
      return;
    }
  }

  errorCache.set(errorKey, now);

  // Log error message and optionally the stack trace
  logger.log({
    level: level,
    message: err.message,
    stack: err.stack // Pass stack trace, but its inclusion depends on logStackTrace flag
  });
}

// Function to log errors with a specific level
function logErrorWithLevel(err, level = 'error') {
  logger.log({
    level: level,
    message: err.message,
    stack: err.stack // Pass stack trace
  });
}

// Function to log errors with additional context
function logErrorWithContext(err, context = {}) {
  logger.log({
    level: 'error',
    message: `${err.message}, Context: ${JSON.stringify(context)}`,
    stack: err.stack // Pass stack trace
  });
}

// Export all necessary functions
module.exports = {
  logErrorWithRateLimiting,  // Rate-limited logging
  logErrorWithLevel,         // Log with specific level
  logErrorWithContext,       // Log with additional context
  logErrorToSentry,          // Sentry logging
  logErrorToDatadog,         // Datadog logging
};

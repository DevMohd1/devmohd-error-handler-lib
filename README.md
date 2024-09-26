
# devmohd-error-handler-lib

A comprehensive error-handling library for Express applications. This package offers structured error handling using custom error classes, global error middleware, utilities for managing asynchronous errors, customizable logging, localization, and external service integrations like Sentry and Datadog.

## Features

### 1. **Winston-based Logging**
   - Integrates with **Winston** for logging errors to the **console** and/or a **log file**.
   - Developers can specify the log file path via `.env` (`LOG_FILE_PATH`).
   - Logs include details such as timestamps, severity levels, categories, and messages.
   - Example log output:
     ```
     2024-09-26T12:00:00 [ERROR] [VALIDATION]: Custom validation error
     ```

### 2. **Asynchronous Error Handling**
   - **`catchAsync`** helper function to wrap asynchronous route handlers, handling errors without try-catch blocks:
     ```javascript
     app.get('/async-route', catchAsync(async (req, res, next) => {
       const data = await fetchData();
       res.json(data);
     }));
     ```

### 3. **Global Error Handler**
   - Centralized middleware that acts as the global error handler for your Express application.
   - Automatically captures and responds to all errors in a consistent JSON format, including `status`, `message`, `stack`, and `meta`.

### 4. **Error Categories and Severity Levels**
   - Errors can be grouped into custom categories (e.g., `validation`, `database`, `authorization`) and assigned severity levels (`info`, `warning`, `error`, `critical`).
   - Helps with error classification and more structured logging.
     ```javascript
     const error = new ValidationError('en', 'Custom validation message');
     error.category = 'validation';
     error.severity = 'warning';
     next(error);
     ```

### 5. **Custom Error Types**
   - Predefined error classes to handle common scenarios:
     - **`ValidationError`**: Handles validation-related errors (400).
     - **`DatabaseError`**: Represents database-related errors (500).
     - **`UnauthorizedError`**: Manages unauthorized access errors (401).
     - **`NotFoundError`**: Deals with not-found errors (404).
   - Default status codes and severity levels are provided for each type, but you can customize as needed.

### 6. **Customizable Error Messages**
   - Custom error messages can be passed to any error type, either in code or via query parameters.
   - Allows you to modify error messages based on development or production needs:
     ```javascript
     throw new ValidationError('en', 'Invalid input data');
     ```

### 7. **Sentry Integration** (Optional)
   - Logs errors to **Sentry** if the Sentry DSN is provided in the `.env` configuration.
   - Useful for remote monitoring and error tracking:
     ```env
     SENTRY_DSN=your_sentry_dsn
     ```
     ```javascript
     logErrorToSentry(err);
     ```

### 8. **Datadog Integration** (Optional)
   - Supports logging errors to **Datadog** if the Datadog API key is provided in the `.env` configuration.
   - Allows for better error tracking in a distributed environment:
     ```env
     DATADOG_API_KEY=your_datadog_api_key
     ```
     ```javascript
     logErrorToDatadog(err);
     ```

### 9. **Stack Trace Logging**
   - The library allows you to control whether the stack trace is logged in the log file.
   - You can enable or disable stack trace logging by setting the **`LOG_STACK_TRACE`** environment variable:
     ```env
     LOG_STACK_TRACE=true  # Logs the stack trace in the log file
     LOG_STACK_TRACE=false # Omits the stack trace in the log file
     ```

### 10. **Custom Log File Path**
   - Allows the developer to specify a custom path for the log file via the `.env` file.
   - If no path is provided, logs will be written only to the console:
     ```env
     LOG_FILE_PATH=./logs/error.log
     ```

### 11. **Localization Support**
   - Localize error messages in multiple languages:
     - **English** (`en`)
     - **Arabic** (`ar`)
     - **Spanish** (`es`)
     - **French** (`fr`)
   - Stack traces remain in English, while the error message is localized:
     ```javascript
     throw new ValidationError('ar', 'فشل التحقق');  // Arabic error message
     ```

---

## Installation

### Library Installation

Install the library via npm:

```bash
npm install devmohd-error-handler-lib
```

### Winston Installation

Since **Winston** is required for logging, you also need to install it as a dependency:

```bash
npm install winston
```

## Usage

### Basic Example

Import and use the library in your Express application:

```javascript
const express = require('express');
const { catchAsync, ValidationError, errorHandler } = require('devmohd-error-handler-lib');

const app = express();

// Route that triggers a validation error
app.get('/validation-error', (req, res, next) => {
  throw new ValidationError('en', 'Validation failed');
});

// Async route with error handling
app.get('/async-error', catchAsync(async (req, res, next) => {
  const data = await someAsyncFunction();
  if (!data) {
    throw new ValidationError('en', 'Data not found');
  }
  res.json(data);
}));

// Global error handler
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Customizing Error Messages, Categories, and Severity

You can customize the error message, category, and severity:

```javascript
const error = new ValidationError('en', 'Custom validation error');
error.category = 'validation';
error.severity = 'warning';
next(error);
```

### Localization Example

Localized error messages can be used for a better user experience:

```javascript
throw new ValidationError('es', 'La validación falló');  // Spanish error message
```

### Stack Trace Logging

You can control whether to log the stack trace in the log file by setting the `LOG_STACK_TRACE` flag:

```env
LOG_STACK_TRACE=true  # Enable stack trace logging
LOG_STACK_TRACE=false # Disable stack trace logging
```

### Logging Example

You can simulate logging an error without throwing an HTTP response:

```javascript
const simulatedError = new Error('Simulated error for logging');
logErrorWithRateLimiting(simulatedError);
```

## Configuration

### Environment Variables

You can configure the library using the following environment variables in your `.env` file:

- **`LOG_FILE_PATH`**: Path to log errors into a file (optional). If not provided, logs will only be printed to the console.
- **`LOG_STACK_TRACE`**: Set to `true` to log the stack trace in the log file, or `false` to omit the stack trace.
- **`SENTRY_DSN`**: Your Sentry DSN for remote logging (optional).
- **`DATADOG_API_KEY`**: Your Datadog API key for remote logging (optional).

Example `.env` configuration:

```env
LOG_FILE_PATH=./logs/error.log
LOG_STACK_TRACE=true
SENTRY_DSN=your_sentry_dsn
DATADOG_API_KEY=your_datadog_api_key
```

## License

This project is licensed under the MIT License.

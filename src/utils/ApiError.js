// Custom error class for handling API-related errors
// This extends the built-in JavaScript Error class

class ApiError extends Error {
  constructor(
    statusCode,                        // HTTP status code (400, 401, 404, 500, etc.)
    message = "Something went wrong",  // Default error message
    errors = [],                       // Array for validation or multiple errors
    stack = ""                         // Optional custom stack trace
  ) {
    // Call parent Error class constructor with message
    super(message);

    // Custom properties added to the error object
    this.statusCode = statusCode; // Used by response handler
    this.data = null;             // API consistency: no data on error
    this.message = message;       // Error message
    this.success = false;         // Standard API flag
    this.errors = errors;         // FIXED: assign passed errors array

    // If stack trace is provided manually, use it
    if (stack) {
      this.stack = stack;
    } 
    // Otherwise capture the current stack trace
    else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };

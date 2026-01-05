// A standard class for sending successful API responses
// This helps keep all API responses consistent across the project

class ApiResponse {
  constructor(
    statusCode,              // HTTP status code (200, 201, 204, etc.)
    data,                    // Actual response data (object, array, etc.)
    message = "Success"      // Default success message
  ) {
    // HTTP status code sent to the client
    this.statusCode = statusCode;

    // Data returned from the API
    this.data = data;

    // Message describing the response
    this.message = message;

    // success flag:
    // true  → for status codes < 400
    // false → for errors (handled by ApiError)
    this.success = statusCode < 400;
  }
}

// Exporting so it can be reused in controllers
export { ApiResponse };

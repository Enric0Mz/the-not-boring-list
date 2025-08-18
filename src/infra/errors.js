export class InternalServerError extends Error {
  constructor(message, cause) {
    this.name = "InternalServerError";
    this.message = message || "An unexpected error ocurred";
    this.action = "Please, contact suport for more information";
    this.statusCode = 500;
    this.cause = cause;
  }

  toJson() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.message = message || "Invalid or expired authorization token";
    this.action = "Provide a valid authorization token";
    this.statusCode = 401;
  }

  toJson() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

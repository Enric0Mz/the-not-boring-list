export class InternalServerError extends Error {
  constructor(message, cause) {
    super(message, cause);
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

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.message = message || "Resource not found";
    this.action = "Insert a valid value for the specified resource";
    this.statusCode = 404;
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

export class ServiceUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = "ServiceUnavailableError";
    this.message = message || "The service is unavailable";
    this.action = "Contact the suport for more information";
    this.statusCode = 503;
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

export class UnprocessableEntityError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnprocessableEntityError";
    this.message =
      message || "The value provided for specified resource is incorrect";
    this.action = "Provide a valid value for the specified resource";
    this.statusCode = 422;
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

export class ConflictError extends Error {
  constructor(value, message) {
    super(message);
    this.name = "ConflictError";
    this.message = `The value ${value} already exists for specified field`;
    this.action = "Provide a new value for the specified resource";
    this.statusCode = 409;
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

const customErrors = [
  NotFoundError.name,
  UnauthorizedError.name,
  UnprocessableEntityError.name,
  ServiceUnavailableError.name,
  UnprocessableEntityError.name,
  ConflictError.name,
];

export default customErrors;

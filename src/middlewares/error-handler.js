import { InternalServerError } from "#src/infra/errors.js";
import customErrors from "#src/infra/errors.js";

export default async function errorHandler(error, req, res, next) {
  console.info(error);
  return await res.status(error.statusCode || 500).json({
    error: getErrorObject(error),
  });
}

function getErrorObject(error) {
  if (customErrors.includes(error.name)) {
    return error.toJson();
  } else {
    return new InternalServerError();
  }
}

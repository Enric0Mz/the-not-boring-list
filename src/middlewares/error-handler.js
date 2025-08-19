import { InternalServerError, UnauthorizedError } from "../infra/errors.js";

export default async function errorHandler(error, req, res, next) {
  console.info(error);
  return await res.status(error.statusCode || 500).json({
    error: getErrorObject(error) || "InternalServerError",
  });
}

function getErrorObject(error) {
  if (error instanceof InternalServerError || UnauthorizedError) {
    return error.toJson();
  }
}

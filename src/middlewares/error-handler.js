import {
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "#src/infra/errors.js";

export default async function errorHandler(error, req, res, next) {
  console.info(error);
  return await res.status(error.statusCode || 500).json({
    error: getErrorObject(error),
  });
}

function getErrorObject(error) {
  if (error instanceof UnauthorizedError || error instanceof NotFoundError) {
    return error.toJson();
  } else {
    return new InternalServerError();
  }
}

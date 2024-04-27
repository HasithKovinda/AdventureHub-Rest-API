import { NextFunction, Request, Response } from "express";
import AppError from "../util/AppError";
import ErrorResponse from "../util/ErrorResponse";

function sendErrorDevelopment(err: AppError, res: Response) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorProduction(err: AppError & Error, res: Response) {
  if (err.isOperational) {
    res
      .status(err.statusCode)
      .json({ status: err.status, message: err.message });
  } else {
    console.error("Error 🧨", err);
    return res
      .status(500)
      .json({ status: "error", message: "Something went wrong!" });
  }
}

export function globalErrorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (process.env.NODE_ENV === "development") {
    const devError = error as AppError;
    devError.status = devError.status || "error";
    devError.statusCode = devError.statusCode || 500;
    sendErrorDevelopment(devError, res);
  } else if (process.env.NODE_ENV === "production") {
    const errorResponse = new ErrorResponse(error.name, error);
    sendErrorProduction(errorResponse.getErrorResponse(), res);
  }
  next();
}

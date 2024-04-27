import e, { NextFunction, Request, Response } from "express";
import mongoose, { CastError, MongooseError } from "mongoose";
import AppError from "../util/AppError";

// type GlobalError = mongoose.Error.ValidationError & mongoose.Error.CastError;

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
  let appError = new AppError("Something went wrong", 500);
  if (error.name === "AppError") {
    appError = Object.assign(error);
  } else if (error.name === "CastError") {
    const castError = error as mongoose.Error.CastError;
    const message = `Invalid ${castError.path}: ${castError.value}.`;
    appError = new AppError(message, 400);
  } else if (error.name === "ValidationError") {
    const validatorError = (error as mongoose.Error.ValidationError).errors;
    const values = Object.values(
      validatorError
    ) as mongoose.Error.ValidatorError[];
    const message = `Invalid input data. [${values.join(", ")}]`;
    appError = new AppError(message, 400);
  } else if (error.name === "MongoServerError") {
    const mongoError = error as any;
    if (mongoError.code === 11000) {
      const value = mongoError.keyValue.name;
      const message = `Duplicate fields value:'${value}'. Please use a different value`;
      appError = new AppError(message, 400);
    }
  } else {
    appError.isOperational = false;
    appError.status = "error";
  }

  if (process.env.NODE_ENV === "development") {
    sendErrorDevelopment(appError, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProduction(appError, res);
  }

  next();
}

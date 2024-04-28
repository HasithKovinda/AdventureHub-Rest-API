import mongoose from "mongoose";
import AppError from "./AppError";

export default class ErrorResponse {
  private name: string;
  private error: Error;
  constructor(name: string, error: Error) {
    this.name = name;
    this.error = error;
  }

  getErrorResponse() {
    let appError = new AppError("Something went wrong.", 500);

    // Handle Errors thrown from AppError class
    switch (this.name) {
      case "AppError":
        appError = Object.assign(this.error);
        break;

      //Handled Mongoose Errors
      case "CastError": {
        const castError = this.error as mongoose.Error.CastError;
        const message = `Invalid ${castError.path}: ${castError.value}.`;
        appError = new AppError(message, 400);
        break;
      }
      case "ValidationError": {
        const validatorError = (this.error as mongoose.Error.ValidationError)
          .errors;
        const values = Object.values(
          validatorError
        ) as mongoose.Error.ValidatorError[];
        const message = `Invalid input data. [${values.join(", ")}].`;
        appError = new AppError(message, 400);
        break;
      }
      case "MongoServerError": {
        const mongoError = this.error as any;
        if (mongoError.code === 11000) {
          const key = Object.keys(mongoError.keyValue)[0];
          const value = mongoError.keyValue[key];
          const message = `Duplicate fields value:'${value}'. Please use a different value.`;
          appError = new AppError(message, 400);
        }
        break;
      }

      //Handle JWT Token Errors
      case "TokenExpiredError": {
        const message =
          "Your has been expired. Please login in aging to receive a new token.";
        appError = new AppError(message, 401);
        break;
      }
      case "JsonWebTokenError": {
        const message =
          "Your token is invalid. Please login in aging to receive a new token.";
        appError = new AppError(message, 401);
        break;
      }

      //Handle Unexpected Errors
      default: {
        appError.isOperational = false;
        appError.status = "error";
      }
    }

    return appError;
  }
}

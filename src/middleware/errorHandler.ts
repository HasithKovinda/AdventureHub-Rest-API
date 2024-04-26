import { NextFunction, Request, Response } from "express";
import AppError from "../util/AppError";

export function globalErrorHandler(
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(error);
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  res
    .status(error.statusCode)
    .json({ status: error.status, message: error.message });
  next();
}

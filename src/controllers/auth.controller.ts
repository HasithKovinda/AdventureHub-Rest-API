import { NextFunction, Request, Response } from "express";
import catchAsync from "../util/catchAsync";

export const signUp = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(201).json({ status: "success" });
});

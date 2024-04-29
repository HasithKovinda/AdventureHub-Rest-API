import { NextFunction, Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import RepositorySingleton from "../singleton/RepositorySingleton";
import { UserDocument } from "../models/user.model";
import AppError from "../util/AppError";

const userRepository = RepositorySingleton.getUserRepositoryInstance();

export const updateMe = catchAsync(async function (
  req: Request<{}, {}, { name: string; email: string }>,
  res: Response<{}, { user: UserDocument }>,
  next: NextFunction
) {
  const { name, email } = req.body;

  if (!name && !email) {
    return next(new AppError("Please provide values for name and email.", 400));
  }

  const updatedUser = await userRepository.update(
    { _id: res.locals.user.id },
    { name, email }
  );

  res.status(200).json({ status: "success", data: { user: updatedUser } });
});

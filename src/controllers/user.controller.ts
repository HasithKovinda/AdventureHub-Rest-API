import { NextFunction, Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import RepositorySingleton from "../singleton/RepositorySingleton";
import { UserDocument } from "../models/user.model";
import AppError from "../util/AppError";
import { CustomResponse } from "../util/CustomResponse";

const userRepository = RepositorySingleton.getUserRepositoryInstance();

export const getAllUsers = catchAsync(async function (
  req: Request,
  res: Response
) {
  const users = await userRepository.getAll();
  CustomResponse.sendGetAllResponse(res, "users", users);
});

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
  CustomResponse.sendGetOneOrUpdateResponse(
    res,
    next,
    "user",
    updatedUser,
    res.locals.user.id
  );
  res.status(200).json({ status: "success", data: { user: updatedUser } });
});

export const deleteMe = catchAsync(async function (
  req: Request,
  res: Response<{}, { user: UserDocument }>,
  next: NextFunction
) {
  await userRepository.update({ _id: res.locals.user.id }, { active: false });

  res.status(204).json({ status: "success", data: null });
});

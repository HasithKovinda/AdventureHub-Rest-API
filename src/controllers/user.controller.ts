import { NextFunction, Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import RepositorySingleton from "../singleton/RepositorySingleton";
import { UserDocument } from "../models/user.model";
import AppError from "../util/AppError";
import { CustomResponse } from "../util/CustomResponse";

const userRepository = RepositorySingleton.getUserRepositoryInstance();

export const getUser = catchAsync(async function (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  const user = await userRepository.findOne({ _id: req.params.id });
  CustomResponse.sendGetOneOrUpdateResponse(
    res,
    next,
    "user",
    user,
    req.params.id
  );
});

export const getAllUsers = catchAsync(async function (
  req: Request,
  res: Response
) {
  const users = await userRepository.getAll(req.query);
  CustomResponse.sendGetAllResponse(res, "users", users);
});

export const getMe = catchAsync(async function (
  req: Request,
  res: Response<{}, { user: UserDocument }>,
  next: NextFunction
) {
  const user = res.locals.user;
  CustomResponse.sendGetOneOrUpdateResponse(res, next, "user", user);
});

export const updateMe = catchAsync(async function (
  req: Request<{}, {}, { name: string; email: string }>,
  res: Response<{}, { user: UserDocument }>,
  next: NextFunction
) {
  const { name, email } = req.body;

  let photo;
  if (req.file) photo = req.file.filename;

  if (!name && !email) {
    return next(new AppError("Please provide values for name or email.", 400));
  }

  const updatedUser = await userRepository.update(
    { _id: res.locals.user.id },
    { name, email, photo }
  );
  CustomResponse.sendGetOneOrUpdateResponse(
    res,
    next,
    "user",
    updatedUser,
    res.locals.user.id
  );
});

export const deleteMe = catchAsync(async function (
  req: Request,
  res: Response<{}, { user: UserDocument }>,
  next: NextFunction
) {
  await userRepository.update({ _id: res.locals.user.id }, { active: false });
  res.status(204).json({ status: "success", data: null });
});

export const updateUser = catchAsync(async function (
  req: Request<{ id: string }, {}, { email: string; name: string }>,
  res: Response<{}, { user: UserDocument }>,
  next: NextFunction
) {
  const { name, email } = req.body;
  const user = await userRepository.update(
    { _id: req.params.id },
    { name, email }
  );
  CustomResponse.sendGetOneOrUpdateResponse(
    res,
    next,
    "user",
    user,
    req.params.id
  );
});

export const deleteUser = catchAsync(async function (
  req: Request,
  res: Response<{}, { user: UserDocument }>,
  next: NextFunction
) {
  const user = await userRepository.delete({ _id: res.locals.user.id });
  CustomResponse.sendDeleteResponse(
    res,
    next,
    "user",
    user,
    res.locals.user.id
  );
});

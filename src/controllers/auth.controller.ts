import { NextFunction, Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import RepositorySingleton from "../singleton/RepositorySingleton";
import { UserInput } from "../models/user.model";

const userRepository = RepositorySingleton.getUserRepositoryInstance();

export const signUp = catchAsync(async function (
  req: Request<{}, {}, UserInput>,
  res: Response,
  next: NextFunction
) {
  const newUser = await userRepository.create(req.body);
  res.status(201).json({ status: "success", data: { user: newUser } });
});

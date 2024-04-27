import { NextFunction, Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import RepositorySingleton from "../singleton/RepositorySingleton";
import { UserInput } from "../models/user.model";
import Auth from "../util/Auth";

const userRepository = RepositorySingleton.getUserRepositoryInstance();

export const signUp = catchAsync(async function (
  req: Request<{}, {}, UserInput>,
  res: Response,
  next: NextFunction
) {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await userRepository.create({
    name,
    email,
    password,
    passwordConfirm,
  });
  const auth = new Auth();
  const token = auth.signIn({ id: newUser._id });
  res.status(201).json({ status: "success", token, data: { user: newUser } });
});

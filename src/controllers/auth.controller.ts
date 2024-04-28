import { NextFunction, Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import RepositorySingleton from "../singleton/RepositorySingleton";
import { UserDocument, UserInput } from "../models/user.model";
import Auth from "../util/Auth";
import AppError from "../util/AppError";

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
  const token = new Auth().signIn({ id: newUser._id });
  res.status(201).json({ status: "success", token, data: { user: newUser } });
});

export const login = catchAsync(async function (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Please provide email and password.", 400));

  const user = await userRepository.findOne(
    { email },
    {
      projection: "+password",
    }
  );

  if (!user || !(await user?.comparePassword(password, user.password)))
    return next(new AppError("email or password incorrect.", 401));

  const token = new Auth().signIn({ id: user._id });
  res.status(200).json({ status: "success", token });
});

export const protectRoute = catchAsync(async function (
  req: Request,
  res: Response<{}, { user: UserDocument }>,
  next: NextFunction
) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(
        "You are not logged in.Please logged into access this resource.",
        401
      )
    );
  }
  const decode = await new Auth().verify(token);
  const user = await userRepository.findOne({ _id: decode.id });

  if (!user)
    return next(new AppError("User belong to this token is not exits.", 401));

  if (user.checkIsPasswordChange(decode.iat!))
    return next(
      new AppError(
        "User recently change the password! Please log in again.",
        401
      )
    );

  res.locals.user = user;
  next();
});

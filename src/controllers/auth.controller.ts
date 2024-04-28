import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import catchAsync from "../util/catchAsync";
import RepositorySingleton from "../singleton/RepositorySingleton";
import { UserDocument, UserInput } from "../models/user.model";
import Auth from "../util/Auth";
import AppError from "../util/AppError";
import { EmailService } from "../util/emailService";

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

export const forgetPassword = catchAsync(async function (
  req: Request<{}, {}, { email: string }>,
  res: Response,
  next: NextFunction
) {
  const { email } = req.body;
  if (!email)
    return next(
      new AppError(
        "Please provide an email address to rest your password.",
        400
      )
    );

  const user = await userRepository.findOne({ email });
  if (!user)
    return next(new AppError("No user found for this email address.", 404));
  const resetToken = user.createRestPasswordToken();
  user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/${resetToken}`;

  const message = `Please click on this link ${resetUrl}  to reset your password`;

  const subject = "Password Reset Email";

  try {
    await new EmailService().sendEmail({ to: email, subject, text: message });
  } catch (error) {
    (user as any)["passwordRestToken"] = undefined;
    (user as any)["passwordRestTokenExpires"] = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending the email. Please try agin leter",
        500
      )
    );
  }
  res
    .status(200)
    .json({ status: "success", message: "token sent to your email address" });
});

export const resetPassword = catchAsync(async function (
  req: Request<
    { token: string },
    {},
    { password: string; passwordConfirm: string }
  >,
  res: Response,
  next: NextFunction
) {
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await userRepository.findOne({
    passwordRestToken: hashToken,
    passwordRestTokenExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("token invalid or expired.", 400));

  const { password, passwordConfirm } = req.body;

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  (user as any)["passwordRestToken"] = undefined;
  (user as any)["passwordRestTokenExpires"] = undefined;

  await user.save();

  const token = new Auth().signIn({ id: user._id });

  res.status(200).json({ status: "success", token });
});

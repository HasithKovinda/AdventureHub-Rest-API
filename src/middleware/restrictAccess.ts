import { NextFunction, Request, Response } from "express";
import { UserDocument } from "../models/user.model";
import AppError from "../util/AppError";

export const restrictAccess = function (...roles: string[]) {
  return function (
    req: Request,
    res: Response<{}, { user: UserDocument }>,
    next: NextFunction
  ) {
    if (!roles.includes(res.locals.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403)
      );
    }

    next();
  };
};

import { NextFunction, Request, Response } from "express";

function catchAsync<T extends Request, U extends Response>(
  fn: (req: T, res: U, next: NextFunction) => Promise<void | NextFunction>
) {
  return function (req: T, res: U, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

export default catchAsync;

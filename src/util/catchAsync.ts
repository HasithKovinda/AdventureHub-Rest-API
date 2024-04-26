import { NextFunction, Request, Response } from "express";

function catchAsync<T extends Request, U extends Response>(
  fn: (req: T, res: U) => Promise<void>
) {
  return function (req: T, res: U, next: NextFunction) {
    fn(req, res).catch(next);
  };
}

export default catchAsync;

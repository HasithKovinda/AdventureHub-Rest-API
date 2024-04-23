import { NextFunction, Request, Response } from "express";
import { TourInput } from "../models/tour.model";
import { Operators } from "../Contracts/ITourRepository";

export function aliasTopTours(
  req: Request<{}, {}, {}, TourInput & Operators>,
  res: Response,
  next: NextFunction
) {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
}

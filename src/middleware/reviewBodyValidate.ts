import { NextFunction, Request, Response } from "express";
import RepositorySingleton from "../singleton/RepositorySingleton";
import AppError from "../util/AppError";

export async function validateTourExits(
  req: Request<{ tourId: string }>,
  res: Response,
  next: NextFunction
) {
  const tourId = req.params.tourId ? req.params.tourId : req.body.tour;
  const tour = await RepositorySingleton.getTourRepositoryInstance().findOne({
    _id: tourId,
  });
  if (!tour)
    return next(
      new AppError(
        `This tour id ${req.params.tourId} is not a valid tour id. Please use a valid tour id to create a new review.`,
        404
      )
    );
  next();
}

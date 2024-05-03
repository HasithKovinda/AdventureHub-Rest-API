import { NextFunction, Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import RepositorySingleton from "../singleton/RepositorySingleton";
import { ReviewInput } from "../models/review.model";
import { UserDocument } from "../models/user.model";

const reviewRepository = RepositorySingleton.getReviewRepositoryInstance();

export const createReview = catchAsync(async function (
  req: Request<{ tourId: string }, {}, ReviewInput>,
  res: Response<{}, { user: UserDocument }>,
  next: NextFunction
) {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  const { id: user } = res.locals.user;
  const review = await reviewRepository.create({ ...req.body, user });
  res.status(201).json({ status: "success", data: { review } });
});

export const getAllReview = catchAsync(async function (
  req: Request<{ tourId: string }>,
  res: Response,
  next: NextFunction
) {
  let tourId = req.params.tourId;
  const review = await reviewRepository.getAll(tourId ? { tour: tourId } : {});
  res
    .status(200)
    .json({ status: "success", results: review.length, data: { review } });
});

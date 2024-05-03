import { NextFunction, Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import RepositorySingleton from "../singleton/RepositorySingleton";
import { ReviewInput } from "../models/review.model";

const reviewRepository = RepositorySingleton.getReviewRepositoryInstance();

export const createReview = catchAsync(async function (
  req: Request<{}, {}, ReviewInput>,
  res: Response,
  next: NextFunction
) {
  const review = await reviewRepository.create(req.body);
  res.status(201).json({ status: "success", data: { review } });
});

export const getAllReview = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const review = await reviewRepository.getAll();
  res
    .status(200)
    .json({ status: "success", results: review.length, data: { review } });
});

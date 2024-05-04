import { NextFunction, Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import RepositorySingleton from "../singleton/RepositorySingleton";
import { ReviewDocument, ReviewInput } from "../models/review.model";
import { UserDocument } from "../models/user.model";
import { CustomResponse } from "../util/CustomResponse";

const reviewRepository = RepositorySingleton.getReviewRepositoryInstance();

export const createReview = catchAsync(async function (
  req: Request<{ tourId: string }, {}, ReviewInput>,
  res: Response<{}, { user: UserDocument }>
) {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  const { id: user } = res.locals.user;
  CustomResponse.sendCreateResponse(
    res,
    "review",
    await reviewRepository.create({ ...req.body, user })
  );
});

export const getAllReview = catchAsync(async function (
  req: Request<{ tourId: string }>,
  res: Response
) {
  let tourId = req.params.tourId;
  const review = await reviewRepository.getAll(tourId ? { tour: tourId } : {});
  CustomResponse.sendGetAllResponse(res, "reviews", review);
});

export const getSingleReview = catchAsync(async function (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  let id = req.params.id;
  const review = await reviewRepository.findOne({ _id: id });
  CustomResponse.sendGetOneOrUpdateResponse(res, next, "review", review, id);
});

export const updateReview = catchAsync(async function (
  req: Request<{ id: string }, {}, ReviewDocument>,
  res: Response,
  next: NextFunction
) {
  let reviewId = req.params.id;
  const review = await reviewRepository.update({ _id: reviewId }, req.body);
  CustomResponse.sendGetOneOrUpdateResponse(
    res,
    next,
    "review",
    review,
    req.params.id
  );
});

export const deleteReview = catchAsync(async function (
  req: Request<{ id: string }, {}, ReviewDocument>,
  res: Response,
  next: NextFunction
) {
  let reviewId = req.params.id;
  const review = await reviewRepository.delete({ _id: reviewId });
  CustomResponse.sendDeleteResponse(res, next, "review", review, req.params.id);
});

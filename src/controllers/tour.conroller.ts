import { Request, Response, RequestHandler, NextFunction } from "express";
import { TourInput } from "../models/tour.model";
import RepositorySingleton from "../singleton/RepositorySingleton";
import { Operators } from "../Contracts/ITourRepository";
import catchAsync from "../util/catchAsync";
import AppError from "../util/AppError";
import { CustomResponse } from "../util/CustomResponse";

const tourRepository = RepositorySingleton.getTourRepositoryInstance();

export const createTour = catchAsync(async function (
  req: Request<{}, {}, TourInput>,
  res: Response
) {
  CustomResponse.sendCreateResponse(
    res,
    "tour",
    await tourRepository.create(req.body)
  );
});

export const getTours = catchAsync(async function (
  req: Request,
  res: Response
) {
  const query = req.query as unknown as TourInput & Operators;
  CustomResponse.sendGetAllResponse(
    res,
    "tours",
    await tourRepository.getAllToursWithAdvanceFilters(query)
  );
});

export const getSingleTour = catchAsync(async function (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const tourId = req.params.id;
  const tour = await tourRepository.findOne(
    { _id: tourId },
    { populate: "reviews" }
  );
  CustomResponse.sendGetOneOrUpdateResponse(res, next, "tour", tour, tourId);
});

export const getTourStatus = catchAsync(async function (
  req: Request,
  res: Response
) {
  const status = await tourRepository.getToursStatistics();
  res.status(200).json({ status: "success", data: { status } });
});

export const getPopularTourYearly = catchAsync(async function (
  req: Request<{ year: string }>,
  res: Response
) {
  const year = +req.params.year;
  const tours = await tourRepository.getPopularTourOfMonth(year);

  res.status(200).json({ status: "success", data: { tours } });
});

export const updateTour = catchAsync(async function (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  const updatedTour = await tourRepository.update(
    { _id: req.params.id },
    req.body as TourInput
  );
  CustomResponse.sendGetOneOrUpdateResponse(
    res,
    next,
    "tour",
    updatedTour,
    req.params.id
  );
});

export const deleteTour = catchAsync(async function (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  const tour = await tourRepository.delete({ _id: req.params.id });
  if (!tour) {
    return next(
      new AppError(`No tour found for this tour id ${req.params.id}`, 404)
    );
  }
  res.status(204).json({ status: "success" });
});

import { Request, Response, RequestHandler, NextFunction } from "express";
import { TourInput } from "../models/tour.model";
import RepositorySingleton from "../singleton/RepositorySingleton";
import { Operators } from "../Contracts/ITourRepository";
import catchAsync from "../util/catchAsync";
import AppError from "../util/AppError";

const tourRepository = RepositorySingleton.getTourRepositoryInstance();

export const createTour = catchAsync(async function (
  req: Request<{}, {}, TourInput>,
  res: Response
) {
  const tourData = req.body;
  const newTour = await tourRepository.create(tourData);
  res.status(201).json({ status: "success", data: { tour: newTour } });
});

export const getTours = catchAsync(async function (
  req: Request,
  res: Response
) {
  const query = req.query as unknown as TourInput & Operators;
  const tours = await tourRepository.getAllToursWithAdvanceFilters(query);
  res
    .status(200)
    .json({ status: "success", results: tours.length, data: { tours } });
});

export const getSingleTour = catchAsync(async function (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const tourId = req.params.id;
  const tour = await tourRepository.findOne({ _id: tourId });

  if (!tour)
    return next(
      new AppError(`No tour found for this tour id ${req.params.id}`, 404)
    );

  res.status(200).json({ status: "success", data: { tour } });
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
  const updateBody = req.body as TourInput;
  const updatedTour = await tourRepository.update(
    { _id: req.params.id },
    updateBody
  );
  if (!updatedTour) {
    return next(
      new AppError(`No tour found for this tour id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ status: "success", data: { updatedTour } });
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

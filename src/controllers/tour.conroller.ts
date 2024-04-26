import { Request, Response, RequestHandler } from "express";
import { TourInput } from "../models/tour.model";
import RepositorySingleton from "../singleton/RepositorySingleton";
import { Operators } from "../Contracts/ITourRepository";
import catchAsync from "../util/catchAsync";

const tourRepository = RepositorySingleton.getTourRepositoryInstance();

export const createTour = catchAsync(async function (
  req: Request<{}, {}, TourInput>,
  res: Response
) {
  const tourData = req.body;
  const newTour = await tourRepository.create(tourData);
  res.status(201).json({ status: "success", tour: newTour });
});

export const getTours = catchAsync(async function (
  req: Request,
  res: Response
) {
  const query = req.query as unknown as TourInput & Operators;
  const tours = await tourRepository.getAllToursWithAdvanceFilters(query);
  res.status(200).json({ status: "success", results: tours.length, tours });
});

export const getSingleTour = catchAsync(async function (
  req: Request<{ id: string }, {}, {}>,
  res: Response
) {
  const tourId = req.params.id;
  const tour = await tourRepository.findOne({ _id: tourId });
  res.status(200).json({ status: "success", tour });
});

export const getTourStatus = catchAsync(async function (
  req: Request,
  res: Response
) {
  const status = await tourRepository.getToursStatistics();
  res.status(200).json({ status: "success", data: status });
});

export const getPopularTourYearly = catchAsync(async function (
  req: Request<{ year: string }>,
  res: Response
) {
  const year = +req.params.year;
  const tours = await tourRepository.getPopularTourOfMonth(year);

  res.status(200).json({ status: "success", data: tours });
});

import { Request, Response, NextFunction } from "express";
import { TourInput } from "../models/tour.model";
import RepositorySingleton from "../singleton/RepositorySingleton";
import { Operators } from "../Contracts/ITourRepository";
import catchAsync from "../util/catchAsync";
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

export const getToursWithDistance = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  const radius = unit === "mi" ? +distance / 3963.2 : +distance / 6378.1;
  if (!lat || !lng) {
    CustomResponse.sendBadRequestResponse(
      res,
      next,
      "Please provide values for latitude and longitude in the format of lat,lng."
    );
  }
  const tours = await tourRepository.getAll({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  CustomResponse.sendGetAllResponse(res, "tours", tours);
});

export const getToursDistance = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  const multiplier = unit === "mi" ? 0.000621371 : 0.001;
  if (!lat || !lng) {
    CustomResponse.sendBadRequestResponse(
      res,
      next,
      "Please provide values for latitude and longitude in the format of lat,lng."
    );
  }
  const tours = await tourRepository.calculateToursDistance(
    multiplier,
    +lat,
    +lng
  );
  CustomResponse.sendGetAllResponse(res, "distances", tours);
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
  CustomResponse.sendDeleteResponse(res, next, "tour", tour, req.params.id);
});

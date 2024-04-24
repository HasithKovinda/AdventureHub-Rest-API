import { Request, Response } from "express";
import { TourInput } from "../models/tour.model";
import RepositorySingleton from "../singleton/RepositorySingleton";
import { Operators } from "../Contracts/ITourRepository";

const tourRepository = RepositorySingleton.getTourRepositoryInstance();

export async function createTour(
  req: Request<{}, {}, TourInput, TourInput>,
  res: Response
) {
  try {
    const tourData = req.body;
    const newTour = await tourRepository.create(tourData);
    res.status(201).json({ status: "success", tour: newTour });
  } catch (error) {
    res.status(404).json({ status: "fail", err: error });
  }
}

export async function getTours(
  req: Request<{}, {}, {}, TourInput & Operators>,
  res: Response
) {
  try {
    const tours = await tourRepository.getAllToursWithAdvanceFilters(req.query);
    return res
      .status(200)
      .json({ status: "success", results: tours.length, tours });
  } catch (error) {
    return res.status(404).json({ status: "fail", error });
  }
}

export async function getSingleTour(
  req: Request<{ id: string }, {}, {}>,
  res: Response
) {
  try {
    const tourId = req.params.id;
    const tour = await tourRepository.findOne({ _id: tourId });
    res.status(200).json({ status: "success", tour });
  } catch (error) {
    res.status(404).json({ status: "fail", err: error });
  }
}

export async function getTourStatus(req: Request, res: Response) {
  try {
    const status = await tourRepository.getToursStatistics();
    res.status(200).json({ status: "success", data: status });
  } catch (error) {
    console.error(error);
    res.status(404).json({ status: "fail", err: error });
  }
}

export async function getPopularTourYearly(
  req: Request<{ year: string }>,
  res: Response
) {
  try {
    const year = +req.params.year;
    const tours = await tourRepository.getPopularTourOfMonth(year);

    res.status(200).json({ status: "success", data: tours });
  } catch (error) {
    console.error(error);
    res.status(404).json({ status: "fail", err: error });
  }
}

import { Request, Response } from "express";
import Tour, { TourInput } from "../models/tour.model";
import RepositorySingleton from "../singleton/RepositorySingleton";

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
  req: Request<{}, {}, {}, TourInput>,
  res: Response
) {
  const newObj = { ...req.query };

  const excludeFelids = ["sort", "page", "limit", "fields"];

  excludeFelids.forEach((el) => delete newObj[el as keyof typeof newObj]);

  const tours = await tourRepository.getAll(newObj);
  return res
    .status(200)
    .json({ status: "success", results: tours.length, tours });
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

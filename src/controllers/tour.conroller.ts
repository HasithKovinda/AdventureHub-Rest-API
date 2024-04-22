import { Request, Response } from "express";
import Tour, { TourInput } from "../models/tour.model";
import { TourRepository } from "../Repository/TourRepository";

const tourRepository = new TourRepository(Tour);

export async function createTour(
  req: Request<{}, {}, TourInput>,
  res: Response
) {
  const tourData = req.body;
  const newTour = await tourRepository.create(tourData);
  res.json({ status: "success", tour: newTour });
}

export async function getTours(req: Request, res: Response) {
  const tours = await Tour.find();
  return res.json({ status: "success", results: tours.length, tours });
}

export async function getSingleTour(
  req: Request<{ id: string }, {}, {}>,
  res: Response
) {
  try {
    const tourId = req.params.id;
    const tour = await tourRepository.findOne({ _id: tourId });
    res.json({ status: "success", tour });
  } catch (error) {
    res.status(404).json({ status: "fail" });
  }
}

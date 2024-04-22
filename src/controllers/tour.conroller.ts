import { Request, Response } from "express";
import Tour from "../models/tour.model";

export async function createTour(req: Request, res: Response) {
  const newTour = await Tour.create(req.body);
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
    const tour = await Tour.findById(tourId);
    res.json({ status: "success", tour });
  } catch (error) {
    res.status(404).json({ status: "fail" });
  }
}

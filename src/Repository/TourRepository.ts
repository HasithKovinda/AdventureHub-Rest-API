import { Model } from "mongoose";
import { GenericRepository } from "./GenericRepository";
import { ITourRepository } from "../Contracts/ITourRepository";
import { TourDocument, TourInput } from "../models/tour.model";

export class TourRepository
  extends GenericRepository<TourDocument, TourInput>
  implements ITourRepository
{
  constructor(model: Model<TourDocument>) {
    super(model);
  }
}

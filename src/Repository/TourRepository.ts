import { FilterQuery, Model, Document, Query } from "mongoose";
import { GenericRepository } from "./GenericRepository";
import { ITourRepository, Operators } from "../Contracts/ITourRepository";
import Tour, { TourDocument, TourInput } from "../models/tour.model";
import AdvanceFiltering from "../util/apiFiltering";

export class TourRepository
  extends GenericRepository<TourDocument, TourInput>
  implements ITourRepository
{
  constructor(model: Model<TourDocument>) {
    super(model);
  }
  async getAllToursWithAdvanceFilters(
    queryValues: TourInput & Operators
  ): Promise<TourDocument[]> {
    const queryFilters = new AdvanceFiltering(this.model, queryValues)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    return (await queryFilters.query) as TourDocument[];
  }
}

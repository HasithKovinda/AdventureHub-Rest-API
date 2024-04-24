import { IGenericRepository } from "./IGenericRepository";
import { TourDocument, TourInput } from "../models/tour.model";
import { FilterQuery } from "mongoose";

export interface Operators {
  sort: string;
  page: string;
  limit: string;
  fields: string;
}

export interface ITourRepository
  extends IGenericRepository<TourDocument, TourInput> {
  //Defined specific methods to Tour Model
  getAllToursWithAdvanceFilters(
    query?: FilterQuery<TourInput & Operators>
  ): Promise<TourDocument[]>;
}

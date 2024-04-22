import { IGenericRepository } from "./IGenericRepository";
import { TourDocument, TourInput } from "../models/tour.model";

export interface ITourRepository
  extends IGenericRepository<TourDocument, TourInput> {
  //Defined specific methods to Tour Model
}

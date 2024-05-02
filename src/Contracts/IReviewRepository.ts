import { ReviewDocument, ReviewInput } from "../models/review.model";
import { IGenericRepository } from "./IGenericRepository";

export interface IReviewRepository
  extends IGenericRepository<ReviewDocument, ReviewInput> {
  //Defined specific methods to Review Model
}

import { Model } from "mongoose";
import { GenericRepository } from "./GenericRepository";
import { IReviewRepository } from "../Contracts/IReviewRepository";
import { ReviewDocument, ReviewInput } from "../models/review.model";

export class ReviewRepository
  extends GenericRepository<ReviewDocument, ReviewInput>
  implements IReviewRepository
{
  constructor(model: Model<ReviewDocument>) {
    super(model);
  }
}

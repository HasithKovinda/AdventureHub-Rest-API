import { FilterQuery, Model } from "mongoose";
import { GenericRepository } from "./GenericRepository";
import { ITourRepository, Operators } from "../Contracts/ITourRepository";
import { TourDocument, TourInput } from "../models/tour.model";

export class TourRepository
  extends GenericRepository<TourDocument, TourInput>
  implements ITourRepository
{
  constructor(model: Model<TourDocument>) {
    super(model);
  }
  async getAllTours(
    queryValues?: FilterQuery<TourInput & Operators>
  ): Promise<TourDocument[]> {
    const newObj = { ...queryValues };
    const excludeFelids = ["sort", "page", "limit", "fields"];

    excludeFelids.forEach((el) => delete newObj[el as keyof typeof newObj]);

    const queryStr = JSON.stringify(newObj).replace(
      /\b(gte?|lte?)\b/g,
      (match) => `$${match}`
    );
    let query = this.model.find(JSON.parse(queryStr));

    if (queryValues?.sort) {
      const sortBy = queryValues?.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-_id");
    }

    if (queryValues?.fields) {
      const fields = queryValues?.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    const page = queryValues?.page * 1 || 1;
    const limit = queryValues?.limit * 1 || 10;
    const skip = (page - 1) * limit;
    console.log("🚀 ~ limit:", limit);
    console.log("🚀 ~ skip:", skip);

    query = query.skip(skip).limit(limit);

    if (queryValues?.page) {
      const numberOfTours = await this.model.countDocuments();
      if (skip >= numberOfTours) throw new Error("Page does not extis");
    }

    return await query;
  }
}

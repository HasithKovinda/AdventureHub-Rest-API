import { Model, Document } from "mongoose";
import { TourInput } from "../models/tour.model";
import { Operators } from "../Contracts/ITourRepository";

export default class AdvanceFiltering<T extends Document> {
  public query: ReturnType<Model<T>["find"]>;
  public queryString: TourInput & Operators;
  constructor(model: Model<T>, queryString: TourInput & Operators) {
    this.query = model.find();
    this.queryString = queryString;
  }

  public filter() {
    const newObj = { ...this.queryString };
    const excludeFelids = ["sort", "page", "limit", "fields"];

    excludeFelids.forEach((el) => delete newObj[el as keyof typeof newObj]);

    const queryStr = JSON.stringify(newObj).replace(
      /\b(gte?|lte?)\b/g,
      (match) => `$${match}`
    );
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  public sort() {
    if (this.queryString?.sort) {
      const sortBy = this.queryString?.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-_id");
    }
    return this;
  }

  public limitFields() {
    if (this.queryString?.fields) {
      const fields = this.queryString?.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  public pagination() {
    const page = Number(this.queryString?.page) || 1;
    const limit = Number(this.queryString?.limit) || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

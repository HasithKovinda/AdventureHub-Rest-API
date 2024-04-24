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

  async getToursStatistics(): Promise<TourDocument[]> {
    return await this.model.aggregate([
      {
        $match: {
          ratingsAverage: { $gte: 4.5 },
        },
      },
      {
        $group: {
          _id: "$difficulty",
          numTours: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          avgRatings: { $avg: "$ratingsAverage" },
          numRatings: { $sum: "$ratingsQuantity" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $addFields: {
          avgPrice: {
            $round: ["$avgPrice", 2],
          },
        },
      },
      {
        $sort: {
          avgPrice: 1,
        },
      },
    ]);
  }
  async getPopularTourOfMonth(year: number): Promise<TourDocument[]> {
    return await this.model.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: {
            $month: "$startDates",
          },
          numOfTours: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          numOfTours: -1,
        },
      },
    ]);
  }
}

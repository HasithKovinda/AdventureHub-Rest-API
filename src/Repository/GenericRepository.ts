import { IGenericRepository } from "../Contracts/IGenericRepository";
import {
  Model,
  Document,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";

export class GenericRepository<T extends Document, U>
  implements IGenericRepository<T, U>
{
  protected model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(body: any): Promise<T> {
    return await this.model.create(body);
  }
  async getAll(query?: FilterQuery<T>): Promise<T[]> {
    query = query ? query : [];
    return await this.model.find(query);
  }
  async findOne(
    query: FilterQuery<T>,
    options: QueryOptions = { lean: true }
  ): Promise<T | null> {
    return await this.model.findOne(query, {}, options);
  }

  async update(
    query: FilterQuery<T>,
    update: UpdateQuery<T>,
    options: QueryOptions
  ): Promise<T | null> {
    return await this.model.findByIdAndUpdate(query, update, options);
  }

  async delete(query: FilterQuery<T>): Promise<void | null> {
    return await this.model.findByIdAndDelete(query);
  }
}

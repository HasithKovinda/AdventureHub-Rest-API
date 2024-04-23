import { Document, FilterQuery, UpdateQuery, QueryOptions } from "mongoose";

export interface IGenericRepository<T extends Document, U> {
  create(body: U): Promise<T>;
  getAll(query?: FilterQuery<T>): Promise<T[]>;
  findOne(query: FilterQuery<T>, options: QueryOptions): Promise<T | null>;
  update(
    query: FilterQuery<T>,
    update: UpdateQuery<T>,
    options: QueryOptions
  ): Promise<T | null>;

  delete(query: FilterQuery<T>): Promise<void | null>;
}

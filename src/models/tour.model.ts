import mongoose, { Document } from "mongoose";

export interface TourInput {
  name: string;
  price: number;
}

export interface TourDocument extends TourInput, Document {
  createdAt: Date;
  updatedAt: Date;
}

const TourSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
  },
  { timestamps: true }
);

const Tour = mongoose.model<TourDocument>("Tour", TourSchema);

export default Tour;

import mongoose, { Document } from "mongoose";

export interface TourInput {
  name: string;
  duration: Number;
  price: Number;
  maxGroupSize: Number;
  difficulty: string;
  ratingAverage: Number;
  ratingQuantity: Number;
  priceDiscount: Number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startDates: Date[];
}

export interface TourDocument extends TourInput, Document {
  createdAt: Date;
}

const TourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    trim: true,
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, "A tour must have a duration"],
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a max group size"],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty"],
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  priceDiscount: {
    type: Number,
  },
  summary: {
    type: String,
    required: [true, "A tour must have a summary"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "A tour must have a  description"],
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have a cover image"],
  },
  images: [String],
  startDates: [Date],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Tour = mongoose.model<TourDocument>("Tour", TourSchema);

export default Tour;

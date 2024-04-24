import mongoose, { Document } from "mongoose";
import slugify from "slugify";

export interface TourInput {
  name: string;
  duration: Number;
  price: Number;
  maxGroupSize: Number;
  difficulty: string;
  ratingsAverage: Number;
  ratingsQuantity: Number;
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
  slug: String,
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
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
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
    select: false,
  },
});

//Document Middleware

TourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { trim: true, lower: true });
  next();
});

const Tour = mongoose.model<TourDocument>("Tour", TourSchema);

export default Tour;

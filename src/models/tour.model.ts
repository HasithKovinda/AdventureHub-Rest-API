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
  slug: string;
}

const TourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    trim: true,
    unique: true,
    minLength: [10, "A tour name should have at least 10 characters"],
    maxLength: [40, "A tour name should not be exceed 40 characters"],
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
    enum: {
      values: ["easy", "medium", "difficult"],
      message: "difficulty should have easy or medium or difficult",
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, "A rating should have a value above 1"],
    max: [5, "A rating should have a value bellow 6"],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val: Number) {
        return val < (this as TourInput).price;
      },
      message: "Discount price {VALUE} should be less than regular price",
    },
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
  secretTour: {
    type: Boolean,
    default: false,
  },
  startLocation: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: [Number],
    address: String,
    description: String,
  },
  Location: [
    {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number,
    },
  ],
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

TourSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as TourDocument;
  if (update.name) {
    update.slug = slugify(update.name, { trim: true, lower: true });
  }
  next();
});

//Query Middleware

TourSchema.pre(
  /^find/,
  function (this: mongoose.Query<TourDocument, TourInput>, next) {
    this.find({ secretTour: { $ne: true } });
    (this as any).start = Date.now();
    next();
  }
);

TourSchema.post(/^find/, function (docs, next) {
  console.log(`Query Took ${Date.now() - (this as any).start} milliseconds ⌛`);
  next();
});

//Aggregation Middleware
TourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model<TourDocument>("Tour", TourSchema);

export default Tour;

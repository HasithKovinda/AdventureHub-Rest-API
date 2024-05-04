import mongoose, { Document } from "mongoose";
import Tour, { TourDocument } from "./tour.model";
import { UserDocument } from "./user.model";

export interface ReviewInput {
  review: string;
  rating: number;
  tour: TourDocument["id"];
  user: UserDocument["id"];
}

export interface ReviewDocument extends ReviewInput, Document {
  createdAt: Date;
  updatedAt: Date;
  calculateAvgRating: void;
}

const ReviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      trim: true,
      required: [true, "Review can not be empty"],
    },
    rating: {
      type: Number,
      required: [true, "Review should have a rating"],
      min: [1, "A rating should have a value above 1"],
      max: [5, "A rating should have a value bellow 6"],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//Query Middleware
ReviewSchema.pre(
  /^find/,
  function (this: mongoose.Query<ReviewDocument, ReviewDocument>, next) {
    this.populate({
      path: "user",
      select: "name photo",
    });
    next();
  }
);

//Static Method
ReviewSchema.statics.calculateAvgRating = async function (tourId: string) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  });
};

ReviewSchema.post("save", function () {
  (this as any).constructor.calculateAvgRating(this.tour);
});

const Review = mongoose.model<ReviewDocument>("Review", ReviewSchema);

export default Review;

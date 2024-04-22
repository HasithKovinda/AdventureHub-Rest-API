import mongoose from "mongoose";

const TourSchema = new mongoose.Schema({
  name: String,
});

const Tour = mongoose.model("Tour", TourSchema);

export default Tour;

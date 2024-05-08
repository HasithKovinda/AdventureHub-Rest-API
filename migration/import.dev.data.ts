import config from "config";
import mongoose from "mongoose";
import fs from "fs";
import Tour from "../src/models/tour.model";
import User from "../src/models/user.model";
import Review from "../src/models/review.model";

let connectString = config.get<string>("CONNECTION_STRING");

mongoose
  .connect(connectString)
  .then(() => {
    console.log("Db connection successful ✨");
  })
  .catch((err) => {
    console.error(err);
  });

//Read the dev-data json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

// import Tour data
async function importDevData() {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("Dev data uploaded successfully 👌");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
}

//delete all tour data
async function deleteDevData() {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Dev data deleted successfully 👌");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
}
console.log(process.argv);
if (process.argv[2] === "--import") {
  importDevData();
} else if (process.argv[2] === "--delete") {
  deleteDevData();
}

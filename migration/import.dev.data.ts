import config from "config";
import mongoose from "mongoose";
import fs from "fs";
import Tour from "../src/models/tour.model";

const env = process.env.NODE_ENV;

let connectString = config.get<string>("connection_string");
connectString =
  env === "development"
    ? config.get("connection_string")
    : connectString.replace("<PASSWORD>", config.get("DbPassword"));

mongoose
  .connect(connectString)
  .then(() => {
    console.log("Db connection successful ✨");
  })
  .catch((err) => {
    console.error(err);
  });

//Read the dev-data json file
const data = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));

//import Tour data
async function importDevData() {
  try {
    await Tour.create(data);
    console.log("Dev data uploaded successfully 👌");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
    process.exit();
  }
}

//delete all tour data
async function deleteDevData() {
  try {
    await Tour.deleteMany();
    console.log("Dev data deleted successfully 👌");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
    process.exit();
  }
}

if (process.argv[2] === "--import") {
  importDevData();
} else if (process.argv[2] === "--delete") {
  deleteDevData();
}

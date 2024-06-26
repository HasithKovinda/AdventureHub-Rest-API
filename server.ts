import config from "config";
import mongoose from "mongoose";

process.on("uncaughtException", (error: Error) => {
  console.log("Uncaught Exception 🎃 Shutting down the server....");
  console.log(`Error Name:`, error.name);
  console.log(`Error Message:`, error.message);
  process.exit(1);
});

import app from "./app";

const port = config.get<number>("PORT") || 8000;

let connectString = config.get<string>("CONNECTION_STRING");

mongoose.connect(connectString).then(() => {
  console.log("Db connection successful ✨");
});

const server = app.listen(port, () => {
  console.log(`Server Listen On Port ${port} ✔`);
});

process.on("unhandledRejection", (error: Error) => {
  console.log("Unhandled Rejection 🎃 Shutting down the server....");
  console.log(`Error Name:`, error.name);
  console.log(`Error Message:`, error.message);
  server.close(() => {
    process.exit(1);
  });
});

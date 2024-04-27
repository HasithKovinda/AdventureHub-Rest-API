import app from "./app";
import config from "config";
import mongoose from "mongoose";

const port = config.get<number>("port") || 8000;
const env = process.env.NODE_ENV;
console.log("🚀 ~ env:", env);

let connectString = config.get<string>("connection_string");
connectString = config.get<string>("connection_string");

mongoose.connect(connectString).then(() => {
  console.log("Db connection successful ✨");
});

const server = app.listen(port, () => {
  console.log(`Server Listen On Port ${port} ✔`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log(`Error Name: ${err.name}`, `Error message: ${err.message}`);
  console.log("Error Occurred 🎃 Shutting down the server....");
  server.close(() => {
    process.exit(1);
  });
});

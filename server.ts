import app from "./app";
import config from "config";
import mongoose from "mongoose";

const port = config.get<number>("port") || 8000;
const env = process.env.NODE_ENV;
console.log("🚀 ~ env:", env);

let connectString = config.get<string>("connection_string");
connectString =
  env === "development"
    ? config.get<string>("connection_string")
    : connectString.replace("<PASSWORD>", config.get<string>("DbPassword"));

mongoose
  .connect(connectString)
  .then(() => {
    console.log("Db connection successful ✨");
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(port, () => {
  console.log(`Server Listen On Port ${port} ✔`);
});

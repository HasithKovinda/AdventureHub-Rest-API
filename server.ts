import app from "./app";
import config from "config";
import mongoose from "mongoose";

const port = config.get<number>("port") || 8000;

const connectString = config.get<string>("connection_string");

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

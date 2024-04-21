import app from "./app";
import config from "config";

const port = config.get<number>("port") || 8000;
const env = app.get("env");
console.log(process.env);
app.listen(port, () => {
  console.log(`Server Listen On Port ${port}`);
});

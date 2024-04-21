import express from "express";
import morgan from "morgan";
import tourRoute from "./src/routes/tour.route";

// Express Configurations

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
  console.log("Hello From Middleware 👏");
  next();
});

app.use("/api/v1/tours", tourRoute);

export default app;

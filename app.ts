import express, { NextFunction, Request, Response } from "express";
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

app.all("*", (req: Request, res: Response) => {
  return res.status(404).json({
    status: "fail",
    message: `Can't find this route ${req.originalUrl} on this server`,
  });
});

export default app;

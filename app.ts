import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import tourRoute from "./src/routes/tour.route";
import AppError from "./src/util/AppError";
import { globalErrorHandler } from "./src/middleware/errorHandler";

// Express Configurations

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
  console.log("Hello From Middleware 👏");
  next();
});

app.use("/api/v1/tours", tourRoute);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(`Can't find this route ${req.originalUrl} on this server`, 404)
  );
});

app.use(globalErrorHandler);

export default app;

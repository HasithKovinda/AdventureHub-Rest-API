import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import tourRoute from "./src/routes/tour.route";
import userRoute from "./src/routes/user.route";
import AppError from "./src/util/AppError";
import { globalErrorHandler } from "./src/middleware/errorHandler";

// Express Configurations

const app = express();
app.use(morgan("dev"));
app.use(express.json());
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  message: "Too many requests from this IP. Please try agin after one hour.",
});

app.use(limiter);

app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/user", userRoute);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(`Can't find this route ${req.originalUrl} on this server`, 404)
  );
});

app.use(globalErrorHandler);

export default app;

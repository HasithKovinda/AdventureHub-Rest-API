import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import tourRoute from "./src/routes/tour.route";
import userRoute from "./src/routes/user.route";
import AppError from "./src/util/AppError";
import { globalErrorHandler } from "./src/middleware/errorHandler";

const app = express();

app.use(morgan("dev"));

//Set HTTP response headers
app.use(helmet());

app.use(express.json());

//Prevent NoSql query injection attack
app.use(mongoSanitize());

//Limit Incoming requests for an hour
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 100,
  message: "Too many requests from this IP. Please try agin after one hour.",
});

app.use(limiter);

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "difficulty",
      "price",
      "maxGroupSize",
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);

//Routes
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/user", userRoute);

//Handle not define routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(`Can't find this route ${req.originalUrl} on this server`, 404)
  );
});

//Global error middleware
app.use(globalErrorHandler);

export default app;

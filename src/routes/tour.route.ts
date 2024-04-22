import express from "express";
import {
  getTours,
  createTour,
  getSingleTour,
} from "../controllers/tour.conroller";
const router = express.Router();

router.route("/").get(getTours).post(createTour);

router.route("/:id").get(getSingleTour);

export default router;

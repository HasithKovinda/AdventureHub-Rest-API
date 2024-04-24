import express from "express";
import {
  getTours,
  createTour,
  getSingleTour,
  getTourStatus,
  getPopularTourYearly,
} from "../controllers/tour.conroller";
import { aliasTopTours } from "../middleware/topTours";
const router = express.Router();

router.route("/top-5-cheap").get(aliasTopTours, getTours);

router.route("/tour-status").get(getTourStatus);

router.route("/popular-tour/:year").get(getPopularTourYearly);

router.route("/").get(getTours).post(createTour);

router.route("/:id").get(getSingleTour);

export default router;

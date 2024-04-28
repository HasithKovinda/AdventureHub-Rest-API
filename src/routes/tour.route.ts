import express from "express";
import {
  getTours,
  createTour,
  getSingleTour,
  getTourStatus,
  getPopularTourYearly,
  updateTour,
  deleteTour,
} from "../controllers/tour.conroller";
import { protectRoute } from "../controllers/auth.controller";
import { aliasTopTours } from "../middleware/topTours";
const router = express.Router();

router.route("/top-5-cheap").get(aliasTopTours, getTours);

router.route("/tour-status").get(getTourStatus);

router.route("/popular-tour/:year").get(getPopularTourYearly);

router.route("/").get(protectRoute, getTours).post(createTour);

router.route("/:id").get(getSingleTour).patch(updateTour).delete(deleteTour);

export default router;

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
import { restrictAccess } from "../middleware/restrictAccess";
import { Role } from "../models/user.model";
import ReviewRoute from "./review.route";

const router = express.Router();

//Nested Route(merge params)
router.use("/:tourId/reviews", ReviewRoute);

router.route("/top-5-cheap").get(aliasTopTours, getTours);

router.route("/tour-status").get(getTourStatus);

router.route("/popular-tour/:year").get(getPopularTourYearly);

router.route("/").get(protectRoute, getTours).post(createTour);

router
  .route("/:id")
  .get(getSingleTour)
  .patch(updateTour)
  .delete(protectRoute, restrictAccess(Role.admin, Role.leadGuid), deleteTour);

export default router;

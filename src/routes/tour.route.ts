import express from "express";
import {
  getTours,
  createTour,
  getSingleTour,
  getTourStatus,
  getPopularTourYearly,
  updateTour,
  deleteTour,
  getToursWithDistance,
  getToursDistance,
} from "../controllers/tour.conroller";
import { protectRoute } from "../controllers/auth.controller";
import { aliasTopTours } from "../middleware/topTours";
import { restrictAccess } from "../middleware/restrictAccess";
import { Role } from "../models/user.model";
import ReviewRoute from "./review.route";
import {
  setTourImages,
  uploadTourImages,
} from "../middleware/multipleImageUpload";

const router = express.Router();

//Nested Route(merge params)
router.use("/:tourId/reviews", ReviewRoute);

router.route("/top-5-cheap").get(aliasTopTours, getTours);

router.route("/tour-status").get(protectRoute, getTourStatus);

router.route("/popular-tour/:year").get(protectRoute, getPopularTourYearly);

router
  .route("/")
  .get(getTours)
  .post(protectRoute, restrictAccess(Role.admin, Role.leadGuid), createTour);

router
  .route("/distance-within/:distance/center/:latlng/unit/:unit")
  .get(getToursWithDistance);

router.route("/distance/center/:latlng/unit/:unit").get(getToursDistance);

router
  .route("/:id")
  .get(getSingleTour)
  .patch(
    protectRoute,
    restrictAccess(Role.admin, Role.leadGuid),
    setTourImages,
    uploadTourImages,
    updateTour
  )
  .delete(protectRoute, restrictAccess(Role.admin, Role.leadGuid), deleteTour);

export default router;

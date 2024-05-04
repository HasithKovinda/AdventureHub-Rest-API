import express from "express";
import { protectRoute } from "../controllers/auth.controller";
import {
  createReview,
  deleteReview,
  getAllReview,
  getSingleReview,
  updateReview,
} from "../controllers/review.controller";
import { restrictAccess } from "../middleware/restrictAccess";
import { Role } from "../models/user.model";
import { validateTourExits } from "../middleware/reviewBodyValidate";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protectRoute, getAllReview)
  .post(
    protectRoute,
    restrictAccess(Role.user),
    validateTourExits,
    createReview
  );

router
  .route("/:id")
  .get(protectRoute, restrictAccess(Role.user), getSingleReview)
  .patch(protectRoute, restrictAccess(Role.user), updateReview)
  .delete(protectRoute, restrictAccess(Role.user), deleteReview);

export default router;

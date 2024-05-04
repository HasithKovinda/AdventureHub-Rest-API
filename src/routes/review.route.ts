import express from "express";
import { protectRoute } from "../controllers/auth.controller";
import {
  createReview,
  getAllReview,
  updateReview,
} from "../controllers/review.controller";
import { restrictAccess } from "../middleware/restrictAccess";
import { Role } from "../models/user.model";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protectRoute, getAllReview)
  .post(protectRoute, restrictAccess(Role.user), createReview);

router
  .route("/:id")
  .patch(protectRoute, restrictAccess(Role.user), updateReview);

export default router;

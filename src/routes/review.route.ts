import express from "express";
import { protectRoute } from "../controllers/auth.controller";
import { createReview, getAllReview } from "../controllers/review.controller";
import { restrictAccess } from "../middleware/restrictAccess";
import { Role } from "../models/user.model";

const router = express.Router();

router
  .route("/")
  .get(protectRoute, getAllReview)
  .post(protectRoute, restrictAccess(Role.user), createReview);

export default router;

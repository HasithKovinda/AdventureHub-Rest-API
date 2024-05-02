import express from "express";
import { protectRoute } from "../controllers/auth.controller";
import { createReview, getAllReview } from "../controllers/review.controller";

const router = express.Router();

router
  .route("/")
  .get(protectRoute, getAllReview)
  .post(protectRoute, createReview);

export default router;

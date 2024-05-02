import express from "express";
import { protectRoute } from "../controllers/auth.controller";
import { createReview } from "../controllers/review.controller";

const router = express.Router();

router.route("/").get().post(protectRoute, createReview);

export default router;

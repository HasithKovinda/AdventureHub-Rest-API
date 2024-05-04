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

router.use(protectRoute);

router
  .route("/")
  .get(getAllReview)
  .post(restrictAccess(Role.user), validateTourExits, createReview);

router
  .route("/:id")
  .get(restrictAccess(Role.user, Role.admin), getSingleReview)
  .patch(restrictAccess(Role.user, Role.admin), updateReview)
  .delete(restrictAccess(Role.user, Role.admin), deleteReview);

export default router;

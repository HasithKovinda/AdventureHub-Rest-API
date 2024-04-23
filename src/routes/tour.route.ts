import express from "express";
import {
  getTours,
  createTour,
  getSingleTour,
} from "../controllers/tour.conroller";
import { aliasTopTours } from "../middleware/topTours";
const router = express.Router();

router.route("/top-5-cheap").get(aliasTopTours, getTours);

router.route("/").get(getTours).post(createTour);

router.route("/:id").get(getSingleTour);

export default router;

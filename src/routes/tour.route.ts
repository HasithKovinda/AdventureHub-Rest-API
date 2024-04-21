import express from "express";
import { getTours } from "../controllers/tour.conroller";
const router = express.Router();

router.route("/").get(getTours);

export default router;

import express from "express";
import {
  signUp,
  login,
  resetPassword,
  forgetPassword,
  updatePassword,
  protectRoute,
} from "../controllers/auth.controller";
import {
  deleteMe,
  getAllUsers,
  updateMe,
} from "../controllers/user.controller";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgetPassword", forgetPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updateMyPassword", protectRoute, updatePassword);
router.patch("/updateMe", protectRoute, updateMe);
router.delete("/deleteMe", protectRoute, deleteMe);

router.route("/").get(getAllUsers);

export default router;

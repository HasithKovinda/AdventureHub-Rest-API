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
  deleteUser,
  getAllUsers,
  getMe,
  getUser,
  updateMe,
  updateUser,
} from "../controllers/user.controller";
import { restrictAccess } from "../middleware/restrictAccess";
import { Role } from "../models/user.model";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgetPassword", forgetPassword);
router.patch("/resetPassword/:token", resetPassword);

//Authentication Required
router.use(protectRoute);

router.patch("/updateMyPassword", updatePassword);
router.patch("/updateMe", updateMe);
router.delete("/deleteMe", deleteMe);
router.get("/me", getMe);

router.use(restrictAccess(Role.admin));

router.route("/").get(getAllUsers);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;

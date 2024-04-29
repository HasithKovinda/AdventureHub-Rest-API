import express from "express";
import {
  signUp,
  login,
  resetPassword,
  forgetPassword,
  updatePassword,
  protectRoute,
} from "../controllers/auth.controller";
import { updateMe } from "../controllers/user.controller";

const route = express.Router();

route.post("/signup", signUp);
route.post("/login", login);
route.post("/forgetPassword", forgetPassword);
route.patch("/resetPassword/:token", resetPassword);
route.patch("/updateMyPassword", protectRoute, updatePassword);
route.patch("/updateMe", protectRoute, updateMe);

export default route;

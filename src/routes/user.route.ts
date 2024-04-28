import express from "express";
import {
  signUp,
  login,
  resetPassword,
  forgetPassword,
} from "../controllers/auth.controller";

const route = express.Router();

route.post("/signup", signUp);
route.post("/login", login);
route.post("/forgetPassword", forgetPassword);
route.patch("/resetPassword/:token", resetPassword);

export default route;

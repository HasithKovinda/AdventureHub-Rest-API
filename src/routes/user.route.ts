import express from "express";
import { signUp, login } from "../controllers/auth.controller";

const route = express.Router();

route.post("/signup", signUp);
route.post("/login", login);

export default route;

import express from "express";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/auth-controller.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh").post(refresh);
router.route("/logout").post(logout);

export default router;

import { Router } from "express";
import {
  registerController,
  loginController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
  googleAuthController,
  googleAuthCallbackController,
} from "../controllers/authController";
import { authenticate } from "../middlewares/authenticated";

const router = Router();

// routes handle
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/:token", resetPasswordController);
router.get("/google", googleAuthController);
router.get("/google/callback", googleAuthCallbackController);

export default router;

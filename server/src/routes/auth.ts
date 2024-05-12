import { Router } from "express";
import {
  registerController,
  loginController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
  googleAuthController,
  googleAuthCallbackController,
  verifyEmailController,
} from "../controllers/authController";
import { authenticate } from "../middlewares/authenticated";

const router = Router();

// routes handle
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.get("/google", googleAuthController);
router.get("/google/callback", googleAuthCallbackController);
router.get("/verify-email/:token", verifyEmailController);

export default router;

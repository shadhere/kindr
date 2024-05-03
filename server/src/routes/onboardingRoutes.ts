import express, { Router } from "express";
import { createOnboardingData } from "../controllers/onboardingDataController";

const router: Router = express.Router();

// Route to handle onboarding data submission
router.post("/onboarding", createOnboardingData);

export default router;

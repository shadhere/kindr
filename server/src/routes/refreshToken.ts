import { Router } from "express";
import {
  refreshTokenController,
  //   logoutController,
} from "../controllers/refreshTokenController";
import { authenticate } from "../middlewares/authenticated";

const router = Router();

// get new access token
router.post("/", refreshTokenController);

export default router;

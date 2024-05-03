import { Router } from "express";
import {
  getUsersController,
  getUserController,
  deleteUserController,
  updateUserController,
} from "../controllers/usersController";

const router = Router();

// routes handle
router.get("/", getUsersController);
router.get("/user", getUserController);
router.delete("/:userId", deleteUserController);
router.put("/user", updateUserController);

export default router;

import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validateUserRegistration } from "../middleware/validation.middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const userController = new UserController();

// Public routes
router.post(
  "/register",
  validateUserRegistration,
  userController.register.bind(userController)
);

router.post("/login", userController.login.bind(userController));

// Protected routes
router.get(
  "/profile/:id",
  authMiddleware,
  userController.getUserProfile.bind(userController)
);

export default router;

import { Router, Request, Response, NextFunction } from "express";
import { AuthController } from "../controllers/auth.controller";
import { body, validationResult } from "express-validator";
import { validateUserRegistration } from "../middleware/validation.middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  validateUserRegistration,
  authController.register.bind(authController)
);
router.post("/login", authController.login.bind(authController));
router.post(
  "/logout",
  authMiddleware,
  authController.logout.bind(authController)
);

export default router;

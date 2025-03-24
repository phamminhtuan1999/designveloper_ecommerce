/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management endpoints
 */

import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const cartController = new CartController();

router.use(authMiddleware);

router.post("/add", cartController.addItem.bind(cartController));
router.delete(
  "/remove/:itemId",
  cartController.removeItem.bind(cartController)
);
router.get("/", cartController.getCart.bind(cartController));
router.delete("/clear", cartController.clearCart.bind(cartController));

export default router;

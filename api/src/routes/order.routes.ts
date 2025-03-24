import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import {
  authMiddleware,
  sellerMiddleware,
} from "../middleware/auth.middleware";

const router = Router();
const orderController = new OrderController();

router.use(authMiddleware);

// Customer routes
router.post("/", orderController.createOrder.bind(orderController));
router.get("/user", orderController.getUserOrders.bind(orderController));
router.get("/:id", orderController.getOrderById.bind(orderController));
router.put("/:id/cancel", orderController.cancelOrder.bind(orderController));

// Seller routes
router.get(
  "/pending",
  sellerMiddleware,
  orderController.getPendingOrders.bind(orderController)
);
router.put(
  "/:id/complete",
  sellerMiddleware,
  orderController.completeOrder.bind(orderController)
);

export default router;

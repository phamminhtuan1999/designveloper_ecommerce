import { Router } from "express";
import authRoutes from "./auth.routes";
import cartRoutes from "./cart.routes";
import orderRoutes from "./order.routes";
import productRoutes from "./product.routes";
import userRoutes from "./user.routes";

const router = Router();

// Register all routes
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/users", userRoutes);

export default router;

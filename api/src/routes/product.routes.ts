import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import {
  authMiddleware,
  sellerMiddleware,
} from "../middleware/auth.middleware";
import { validateProductCreation } from "../middleware/validation.middleware";

const router = Router();
const productController = new ProductController();

// Public routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.get("/:id/stock", productController.getProductStock);

// Seller only routes
router.post(
  "/",
  authMiddleware,
  sellerMiddleware,
  validateProductCreation,
  productController.createProduct.bind(productController)
);
router.put(
  "/:id",
  authMiddleware,
  sellerMiddleware,
  productController.updateProduct.bind(productController)
);
router.delete(
  "/:id",
  authMiddleware,
  sellerMiddleware,
  productController.deleteProduct.bind(productController)
);
router.put(
  "/:id/stock",
  authMiddleware,
  sellerMiddleware,
  productController.updateStock.bind(productController)
);

export default router;

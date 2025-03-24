import { Request, Response } from "express";
import { CartService } from "../services/cart.service";

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         productId:
 *           type: integer
 *           description: The ID of the product
 *         quantity:
 *           type: integer
 *           description: The quantity of the product
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

interface RequestWithUser extends Request {
  user?: {
    id: number;
  };
}

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  public async addItem(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { productId, quantity } = req.body;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      if (!productId || !quantity) {
        res
          .status(400)
          .json({ message: "Product ID and quantity are required" });
        return;
      }

      const updatedCart = await this.cartService.addItemToCart(
        userId,
        productId,
        quantity
      );
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  }

  public async removeItem(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const productId = parseInt(req.params.itemId);

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      await this.cartService.removeItemFromCart(userId, productId);
      res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  }

  public async getCart(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const cartItems = await this.cartService.getCartItems(userId);
      res.status(200).json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  }

  public async clearCart(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      await this.cartService.clearCart(userId);
      res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  }
}

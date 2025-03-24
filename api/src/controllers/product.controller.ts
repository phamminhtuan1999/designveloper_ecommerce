import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { CustomError } from "../utils/error";

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     Stock:
 *       type: object
 *       properties:
 *         S:
 *           type: integer
 *         M:
 *           type: integer
 *         L:
 *           type: integer
 */

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  /**
   * @swagger
   * /api/products:
   *   get:
   *     summary: Get all products with pagination
   *     tags: [Products]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 20
   *         description: Number of items per page
   *     responses:
   *       200:
   *         description: List of products
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Product'
   */
  public async getAllProducts(req: Request, res: Response): Promise<any> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const products = await this.productService.getAllProducts(page, limit);
      return res.status(200).json(products);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * @swagger
   * /api/products/{id}:
   *   get:
   *     summary: Get product by ID
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Product ID
   *     responses:
   *       200:
   *         description: Product details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Product'
   *       404:
   *         description: Product not found
   */
  public async getProductById(req: Request, res: Response): Promise<any> {
    try {
      const productId = parseInt(req.params.id);
      const product = await this.productService.getProductById(productId);
      return res.status(200).json(product);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * @swagger
   * /api/products/{id}/stock:
   *   get:
   *     summary: Get product stock
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Product ID
   *     responses:
   *       200:
   *         description: Product stock information
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Stock'
   */
  public async getProductStock(req: Request, res: Response): Promise<any> {
    try {
      const productId = parseInt(req.params.id);
      const stock = await this.productService.getProductStock(productId);
      return res.status(200).json(stock);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * @swagger
   * /api/products:
   *   post:
   *     summary: Create a new product
   *     tags: [Products]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - price
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *               price:
   *                 type: number
   *     responses:
   *       201:
   *         description: Product created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Product'
   */
  public async createProduct(req: Request, res: Response): Promise<any> {
    try {
      const productData = req.body;
      const product = await this.productService.createProduct(productData);
      return res.status(201).json(product);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * @swagger
   * /api/products/{id}:
   *   put:
   *     summary: Update product
   *     tags: [Products]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Product ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *               price:
   *                 type: number
   *     responses:
   *       200:
   *         description: Product updated successfully
   */
  public async updateProduct(req: Request, res: Response): Promise<any> {
    try {
      const productId = parseInt(req.params.id);
      const productData = req.body;
      const result = await this.productService.updateProduct(
        productId,
        productData
      );
      return res.status(200).json({ success: result });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * @swagger
   * /api/products/{id}:
   *   delete:
   *     summary: Delete product
   *     tags: [Products]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Product ID
   *     responses:
   *       200:
   *         description: Product deleted successfully
   */
  public async deleteProduct(req: Request, res: Response): Promise<any> {
    try {
      const productId = parseInt(req.params.id);
      const result = await this.productService.deleteProduct(productId);
      return res.status(200).json({ success: result });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * @swagger
   * /api/products/{id}/stock:
   *   put:
   *     summary: Update product stock
   *     tags: [Products]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Product ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - size
   *               - count
   *             properties:
   *               size:
   *                 type: string
   *                 enum: [S, M, L]
   *               count:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Stock updated successfully
   *       400:
   *         description: Invalid size
   */
  public async updateStock(req: Request, res: Response): Promise<any> {
    try {
      const productId = parseInt(req.params.id);
      const { size, count } = req.body;

      if (!["S", "M", "L"].includes(size)) {
        return res
          .status(400)
          .json({ message: "Invalid size. Must be S, M, or L" });
      }

      const result = await this.productService.updateStock(
        productId,
        size as "S" | "M" | "L",
        count
      );
      return res.status(200).json({ success: result });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

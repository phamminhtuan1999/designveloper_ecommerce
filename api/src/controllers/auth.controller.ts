import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import logger from "../utils/logger";

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserCredentials:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 */

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
    logger.debug("AuthController initialized");
  }

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserCredentials'
   *     responses:
   *       201:
   *         description: User successfully registered
   *       400:
   *         description: Invalid input or user already exists
   */
  public async register(req: Request, res: Response): Promise<any> {
    logger.http(`Register request received: ${req.ip}`);
    try {
      const user = await this.authService.register(req.body);
      logger.info(`User registered successfully: ${req.body.email}`);
      return res.status(201).json(user);
    } catch (error: any) {
      logger.error(`Registration failed: ${error.message}`);
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserCredentials'
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *       401:
   *         description: Invalid credentials
   */
  public async login(req: Request, res: Response): Promise<any> {
    logger.http(`Login attempt: ${req.body.email}`);
    try {
      const token = await this.authService.login(req.body);
      logger.info(`User logged in: ${req.body.email}`);
      return res.status(200).json({ token });
    } catch (error: any) {
      logger.warn(`Login failed: ${error.message}`);
      return res.status(401).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: Logout user
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successfully logged out
   *       401:
   *         description: Unauthorized
   */
  public async logout(req: Request, res: Response): Promise<any> {
    logger.http(`Logout request received`);
    try {
      await this.authService.logout(req.body);
      logger.info(`User logged out successfully`);
      return res.status(200).json({ message: "Successfully logged out" });
    } catch (error: any) {
      logger.error(`Logout failed: ${error.message}`);
      return res.status(400).json({ message: error.message });
    }
  }
}

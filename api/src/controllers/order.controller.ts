import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { CustomError } from "../utils/error";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  public async createOrder(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user.id; // From auth middleware
      const { items } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res
          .status(400)
          .json({ message: "Order must contain at least one item" });
      }

      const order = await this.orderService.createOrder(userId, items);
      return res.status(201).json(order);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async getOrderById(req: Request, res: Response): Promise<any> {
    try {
      const orderId = parseInt(req.params.id);
      const orderDetails = await this.orderService.getOrderById(orderId);
      return res.status(200).json(orderDetails);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async getUserOrders(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user.id; // From auth middleware
      const orders = await this.orderService.getUserOrders(userId);
      return res.status(200).json(orders);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async cancelOrder(req: Request, res: Response): Promise<any> {
    try {
      const orderId = parseInt(req.params.id);
      const userId = req.user.id; // From auth middleware

      const result = await this.orderService.cancelOrder(orderId, userId);
      return res.status(200).json({ success: result });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async completeOrder(req: Request, res: Response): Promise<any> {
    try {
      const orderId = parseInt(req.params.id);

      // Only seller can complete orders
      if (req.user.role !== "seller") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const result = await this.orderService.completeOrder(orderId);
      return res.status(200).json({ success: result });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async getPendingOrders(req: Request, res: Response): Promise<any> {
    try {
      // Only seller can view all pending orders
      if (req.user.role !== "seller") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const orders = await this.orderService.getPendingOrders();
      return res.status(200).json(orders);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

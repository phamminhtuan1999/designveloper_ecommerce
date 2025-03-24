import { Order, OrderItem, OrderModel } from "../models/order.model";
import { ProductModel } from "../models/product.model";
import { CustomError } from "../utils/error";
import { EmailService } from "./email.service";

interface CartItem {
  productId: number;
  size: "S" | "M" | "L";
  quantity: number;
  price: number;
}

export class OrderService {
  private orderModel = new OrderModel();
  private productModel = new ProductModel();
  private emailService = new EmailService();

  async createOrder(userId: number, items: CartItem[]): Promise<Order> {
    // Calculate total amount
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order
    const order = await this.orderModel.createOrder({
      user_id: userId,
      status: "pending",
      total_amount: totalAmount,
    });

    // Add order items
    for (const item of items) {
      // Check stock availability
      const stockItems = await this.productModel.getProductStock(
        item.productId
      );
      const sizeStock = stockItems.find((s) => s.size === item.size);

      if (!sizeStock || sizeStock.stock_count < item.quantity) {
        throw new CustomError(
          `Not enough stock for product ID ${item.productId}, size ${item.size}`,
          400
        );
      }

      // Add order item
      await this.orderModel.addOrderItem({
        order_id: order.id!,
        product_id: item.productId,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      });

      // Update stock
      await this.productModel.updateStock(
        item.productId,
        item.size,
        sizeStock.stock_count - item.quantity
      );
    }

    // Send confirmation emails
    await this.sendOrderConfirmationEmails(order.id!);

    return order;
  }

  async getOrderById(
    orderId: number
  ): Promise<{ order: Order; items: OrderItem[] }> {
    const order = await this.orderModel.getOrderById(orderId);
    if (!order) {
      throw new CustomError("Order not found", 404);
    }

    const items = await this.orderModel.getOrderItems(orderId);
    return { order, items };
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return this.orderModel.getUserOrders(userId);
  }

  async cancelOrder(orderId: number, userId: number): Promise<boolean> {
    const order = await this.orderModel.getOrderById(orderId);
    if (!order) {
      throw new CustomError("Order not found", 404);
    }

    if (order.user_id !== userId) {
      throw new CustomError("Unauthorized", 403);
    }

    if (order.status === "completed") {
      throw new CustomError("Cannot cancel a completed order", 400);
    }

    if (order.status === "cancelled") {
      throw new CustomError("Order is already cancelled", 400);
    }

    // Get order items to restore stock
    const items = await this.orderModel.getOrderItems(orderId);

    // Restore stock for each item
    for (const item of items) {
      const stockItems = await this.productModel.getProductStock(
        item.product_id
      );
      const sizeStock = stockItems.find((s) => s.size === item.size);

      if (sizeStock) {
        await this.productModel.updateStock(
          item.product_id,
          item.size,
          sizeStock.stock_count + item.quantity
        );
      }
    }

    // Update order status
    const result = await this.orderModel.updateOrderStatus(
      orderId,
      "cancelled"
    );

    // Send cancellation email
    if (result) {
      await this.sendOrderCancellationEmails(orderId);
    }

    return result;
  }

  async completeOrder(orderId: number): Promise<boolean> {
    const order = await this.orderModel.getOrderById(orderId);
    if (!order) {
      throw new CustomError("Order not found", 404);
    }

    if (order.status !== "pending") {
      throw new CustomError(`Order is ${order.status}, not pending`, 400);
    }

    return this.orderModel.updateOrderStatus(orderId, "completed");
  }

  async getPendingOrders(): Promise<Order[]> {
    return this.orderModel.getPendingOrders();
  }

  private async sendOrderConfirmationEmails(orderId: number): Promise<void> {
    const { order, items } = await this.getOrderById(orderId);

    // Send email to customer
    await this.emailService.sendOrderConfirmation(order, items);

    // Send email to seller
    await this.emailService.sendNewOrderNotification(order, items);
  }

  private async sendOrderCancellationEmails(orderId: number): Promise<void> {
    const { order, items } = await this.getOrderById(orderId);

    // Send email to customer
    await this.emailService.sendOrderCancellationConfirmation(order, items);

    // Send email to seller
    await this.emailService.sendOrderCancellationNotification(order, items);
  }
}

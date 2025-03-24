import nodemailer from "nodemailer";
import { Order, OrderItem } from "../models/order.model";
import { UserModel } from "../models/user.model";
import { ProductModel } from "../models/product.model";

export class EmailService {
  private transporter: nodemailer.Transporter;
  private userModel = new UserModel();
  private productModel = new ProductModel();

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendOrderConfirmation(order: Order, items: OrderItem[]): Promise<void> {
    const user = await this.userModel.findById(order.user_id);
    if (!user) return;

    const itemDetails = await this.getItemDetails(items);

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Order Confirmation #${order.id}`,
      html: `
        <h1>Thank you for your order!</h1>
        <p>Your order #${order.id} has been received and is being processed.</p>
        <h2>Order Details:</h2>
        <ul>
          ${itemDetails
            .map(
              (item) => `
            <li>${item.name} - Size: ${item.size} - Quantity: ${
                item.quantity
              } - $${item.price.toFixed(2)}</li>
          `
            )
            .join("")}
        </ul>
        <p><strong>Total: $${order.total_amount.toFixed(2)}</strong></p>
      `,
    });
  }

  async sendNewOrderNotification(
    order: Order,
    items: OrderItem[]
  ): Promise<void> {
    // Get seller email (assuming there's only one seller with role 'seller')
    const seller = await this.userModel.findByEmail("seller@example.com");
    if (!seller) return;

    const user = await this.userModel.findById(order.user_id);
    const itemDetails = await this.getItemDetails(items);

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: seller.email,
      subject: `New Order #${order.id}`,
      html: `
        <h1>New Order Received!</h1>
        <p>Order #${order.id} has been placed by ${user?.email}.</p>
        <h2>Order Details:</h2>
        <ul>
          ${itemDetails
            .map(
              (item) => `
            <li>${item.name} - Size: ${item.size} - Quantity: ${
                item.quantity
              } - $${item.price.toFixed(2)}</li>
          `
            )
            .join("")}
        </ul>
        <p><strong>Total: $${order.total_amount.toFixed(2)}</strong></p>
      `,
    });
  }

  async sendOrderCancellationConfirmation(
    order: Order,
    items: OrderItem[]
  ): Promise<void> {
    const user = await this.userModel.findById(order.user_id);
    if (!user) return;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Order #${order.id} Cancelled`,
      html: `
        <h1>Order Cancellation Confirmation</h1>
        <p>Your order #${order.id} has been cancelled as requested.</p>
        <p>If you have any questions, please contact our customer service.</p>
      `,
    });
  }

  async sendOrderCancellationNotification(
    order: Order,
    items: OrderItem[]
  ): Promise<void> {
    // Get seller email
    const seller = await this.userModel.findByEmail("seller@example.com");
    if (!seller) return;

    const user = await this.userModel.findById(order.user_id);

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: seller.email,
      subject: `Order #${order.id} Cancelled`,
      html: `
        <h1>Order Cancellation Notification</h1>
        <p>Order #${order.id} placed by ${user?.email} has been cancelled.</p>
      `,
    });
  }

  private async getItemDetails(
    items: OrderItem[]
  ): Promise<Array<OrderItem & { name: string }>> {
    const itemDetails = [];

    for (const item of items) {
      const product = await this.productModel.getProductById(item.product_id);
      if (product) {
        itemDetails.push({
          ...item,
          name: product.name,
        });
      }
    }

    return itemDetails;
  }
}

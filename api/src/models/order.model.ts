import pool from "../config/database";

export interface Order {
  id?: number;
  user_id: number;
  status: "pending" | "completed" | "cancelled";
  total_amount: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface OrderItem {
  id?: number;
  order_id: number;
  product_id: number;
  size: "S" | "M" | "L";
  quantity: number;
  price: number;
}

export class OrderModel {
  private db = pool;

  async createOrder(order: Order): Promise<Order> {
    const query =
      "INSERT INTO orders (user_id, status, total_amount) VALUES (?, ?, ?)";
    const [result] = await this.db.execute(query, [
      order.user_id,
      order.status,
      order.total_amount,
    ]);
    const insertId = (result as any).insertId;
    return { ...order, id: insertId };
  }

  async addOrderItem(item: OrderItem): Promise<OrderItem> {
    const query =
      "INSERT INTO order_items (order_id, product_id, size, quantity, price) VALUES (?, ?, ?, ?, ?)";
    const [result] = await this.db.execute(query, [
      item.order_id,
      item.product_id,
      item.size,
      item.quantity,
      item.price,
    ]);
    const insertId = (result as any).insertId;
    return { ...item, id: insertId };
  }

  async getOrderById(id: number): Promise<Order | null> {
    const query = "SELECT * FROM orders WHERE id = ?";
    const [rows] = await this.db.execute(query, [id]);
    const orders = rows as Order[];
    return orders.length ? orders[0] : null;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    const query = "SELECT * FROM order_items WHERE order_id = ?";
    const [rows] = await this.db.execute(query, [orderId]);
    return rows as OrderItem[];
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    const query = "SELECT * FROM orders WHERE user_id = ?";
    const [rows] = await this.db.execute(query, [userId]);
    return rows as Order[];
  }

  async updateOrderStatus(
    id: number,
    status: "pending" | "completed" | "cancelled"
  ): Promise<boolean> {
    const query = "UPDATE orders SET status = ? WHERE id = ?";
    const [result] = await this.db.execute(query, [status, id]);
    return (result as any).affectedRows > 0;
  }

  async getPendingOrders(): Promise<Order[]> {
    const query = "SELECT * FROM orders WHERE status = 'pending'";
    const [rows] = await this.db.execute(query);
    return rows as Order[];
  }
}

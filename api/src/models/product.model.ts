import pool from "../config/database";

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ProductStock {
  product_id: number;
  size: "S" | "M" | "L";
  stock_count: number;
}

export class ProductModel {
  private db = pool;

  async getAllProducts(
    page: number = 1,
    limit: number = 20
  ): Promise<Product[]> {
    const offset = (page - 1) * limit;
    const query = "SELECT * FROM products LIMIT ? OFFSET ?";
    const [rows] = await this.db.execute(query, [limit, offset]);
    return rows as Product[];
  }

  async getProductById(id: number): Promise<Product | null> {
    const query = "SELECT * FROM products WHERE id = ?";
    const [rows] = await this.db.execute(query, [id]);
    const products = rows as Product[];
    return products.length ? products[0] : null;
  }

  async getProductStock(productId: number): Promise<ProductStock[]> {
    const query = "SELECT * FROM product_stock WHERE product_id = ?";
    const [rows] = await this.db.execute(query, [productId]);
    return rows as ProductStock[];
  }

  async createProduct(product: Product): Promise<Product> {
    const query =
      "INSERT INTO products (name, description, price, image_url, category) VALUES (?, ?, ?, ?, ?)";
    const [result] = await this.db.execute(query, [
      product.name,
      product.description,
      product.price,
      product.image_url,
      product.category || null,
    ]);
    const insertId = (result as any).insertId;
    return { ...product, id: insertId };
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<boolean> {
    const fields = Object.keys(product)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(product);

    const query = `UPDATE products SET ${fields} WHERE id = ?`;
    const [result] = await this.db.execute(query, [...values, id]);
    return (result as any).affectedRows > 0;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const query = "DELETE FROM products WHERE id = ?";
    const [result] = await this.db.execute(query, [id]);
    return (result as any).affectedRows > 0;
  }

  async updateStock(
    productId: number,
    size: "S" | "M" | "L",
    count: number
  ): Promise<boolean> {
    const query =
      "UPDATE product_stock SET stock_count = ? WHERE product_id = ? AND size = ?";
    const [result] = await this.db.execute(query, [count, productId, size]);
    return (result as any).affectedRows > 0;
  }
}

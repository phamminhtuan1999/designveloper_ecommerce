import { Product, ProductModel } from "../models/product.model";
import { CustomError } from "../utils/error";

export class ProductService {
  private productModel = new ProductModel();

  async getAllProducts(
    page: number = 1,
    limit: number = 20
  ): Promise<Product[]> {
    return this.productModel.getAllProducts(page, limit);
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productModel.getProductById(id);
    if (!product) {
      throw new CustomError("Product not found", 404);
    }
    return product;
  }

  async getProductStock(
    id: number
  ): Promise<
    Array<{ product_id: number; size: "S" | "M" | "L"; stock_count: number }>
  > {
    const product = await this.productModel.getProductById(id);
    if (!product) {
      throw new CustomError("Product not found", 404);
    }

    return this.productModel.getProductStock(id);
  }

  async createProduct(productData: Omit<Product, "id">): Promise<Product> {
    return this.productModel.createProduct(productData);
  }

  async updateProduct(
    id: number,
    productData: Partial<Product>
  ): Promise<boolean> {
    const product = await this.productModel.getProductById(id);
    if (!product) {
      throw new CustomError("Product not found", 404);
    }

    return this.productModel.updateProduct(id, productData);
  }

  async deleteProduct(id: number): Promise<boolean> {
    const product = await this.productModel.getProductById(id);
    if (!product) {
      throw new CustomError("Product not found", 404);
    }

    return this.productModel.deleteProduct(id);
  }

  async updateStock(
    productId: number,
    size: "S" | "M" | "L",
    count: number
  ): Promise<boolean> {
    const product = await this.productModel.getProductById(productId);
    if (!product) {
      throw new CustomError("Product not found", 404);
    }

    return this.productModel.updateStock(productId, size, count);
  }
}

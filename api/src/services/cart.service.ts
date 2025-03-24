import { CartModel, CartItem } from "../models/cart.model";

export class CartService {
  private cartModels: Map<number, CartModel> = new Map();

  private getOrCreateCartModel(userId: number): CartModel {
    if (!this.cartModels.has(userId)) {
      this.cartModels.set(userId, new CartModel(userId));
    }
    return this.cartModels.get(userId)!;
  }

  async addItemToCart(
    userId: number,
    productId: number,
    quantity: number
  ): Promise<CartItem[]> {
    const cartModel = this.getOrCreateCartModel(userId);
    cartModel.addItem(productId, quantity);
    return cartModel.getItems();
  }

  async removeItemFromCart(
    userId: number,
    productId: number
  ): Promise<CartItem[]> {
    const cartModel = this.getOrCreateCartModel(userId);
    cartModel.removeItem(productId);
    return cartModel.getItems();
  }

  async getCartItems(userId: number): Promise<CartItem[]> {
    const cartModel = this.getOrCreateCartModel(userId);
    return cartModel.getItems();
  }

  async clearCart(userId: number): Promise<CartItem[]> {
    const cartModel = this.getOrCreateCartModel(userId);
    cartModel.clearCart();
    return cartModel.getItems();
  }
}

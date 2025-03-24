export interface CartItem {
  productId: number;
  quantity: number;
}

export interface Cart {
  userId: number;
  items: CartItem[];
}

export class CartModel {
  private cart: Cart;

  constructor(userId: number) {
    this.cart = { userId, items: [] };
  }

  addItem(productId: number, quantity: number): void {
    const existingItem = this.cart.items.find(
      (item) => item.productId === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.items.push({ productId, quantity });
    }
  }

  removeItem(productId: number): void {
    this.cart.items = this.cart.items.filter(
      (item) => item.productId !== productId
    );
  }

  getItems(): CartItem[] {
    return this.cart.items;
  }

  clearCart(): void {
    this.cart.items = [];
  }
}

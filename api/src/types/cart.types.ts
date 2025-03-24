export interface CartItem {
    productId: number;
    quantity: number;
}

export interface Cart {
    userId: number;
    items: CartItem[];
}

export interface CartResponse {
    userId: number;
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}
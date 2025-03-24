export interface Order {
    id: number;
    userId: number;
    productIds: number[];
    totalAmount: number;
    status: 'pending' | 'completed' | 'canceled';
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateOrderInput {
    userId: number;
    productIds: number[];
    totalAmount: number;
}

export interface UpdateOrderInput {
    status?: 'pending' | 'completed' | 'canceled';
}
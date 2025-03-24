export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductCreate {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
}

export interface ProductUpdate {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    categoryId?: number;
}
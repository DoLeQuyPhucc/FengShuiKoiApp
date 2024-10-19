export interface Order {
    name: string;
    price: number;
    quantity: number;
    address: string;
    comment: string;
    isSelled: boolean;
    _id?: string;
    userId?: string;
    productId?: string;
    createdAt?: string;
    updatedAt?: string;
}
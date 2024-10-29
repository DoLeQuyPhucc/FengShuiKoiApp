// const product = {
//     name: "Smart Watch Pro 2024",
//     price: 250,
//     quantity: 1,
//     description: "A next-gen smartwatch with advanced health monitoring features.",
//     address: "123 Elm Street, Springfield, USA",
//     rating: 4.5,
//     comment: "Amazing features, great battery life!",
//     isSelled: false
//   };

export interface Product {
    _id?: number;
    name: string;
    price: number;
    quantity: number;
    description: string;
    address: string;
    rating?: number;
    comment?: string;
    isSelled: boolean;
    categoryName?: string;
    imageUrl?: string;
    createdAt?: string;
}
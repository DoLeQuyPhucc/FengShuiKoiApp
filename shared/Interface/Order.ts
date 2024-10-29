import { CartItem } from "@/context/CartContext";

export interface Order {
  items: CartItem[];
  totalPrice: number;
  address: string;
  comment: string;
  isSelled: boolean;
}

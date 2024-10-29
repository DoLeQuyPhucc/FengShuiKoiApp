import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCartFromStorage();
  }, []);

  const loadCartFromStorage = async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      if (cartData) {
        setItems(JSON.parse(cartData));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCartToStorage = async (cartItems: CartItem[]) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = async (product: Omit<CartItem, 'quantity'>) => {
    const updatedItems = [...items];
    const existingItemIndex = updatedItems.findIndex(
      item => item.productId === product.productId
    );

    if (existingItemIndex >= 0) {
      updatedItems[existingItemIndex].quantity += 1;
    } else {
      updatedItems.push({ ...product, quantity: 1 });
    }

    setItems(updatedItems);
    await saveCartToStorage(updatedItems);
  };

  const removeFromCart = async (productId: string) => {
    const updatedItems = items.filter(item => item.productId !== productId);
    setItems(updatedItems);
    await saveCartToStorage(updatedItems);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const updatedItems = items.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    setItems(updatedItems);
    await saveCartToStorage(updatedItems);
  };

  const clearCart = async () => {
    setItems([]);
    await AsyncStorage.removeItem('cart');
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
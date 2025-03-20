"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// ✅ Define Product Type Explicitly
export interface Product {
  id: number;
  name: string;
  price: number; // 💰 Ensure price is a number
  image: string;
  category: string;
  quantity: number; // ✅ Ensure quantity exists
}

// ✅ Define Cart Context Type
interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  toggleCart: () => void;
  isCartOpen: boolean;
}

// ✅ Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ✅ Add product to cart
  const addToCart = (newProduct: Product & { quantity: number }) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === newProduct.id);
  
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === newProduct.id
            ? { ...item, quantity: item.quantity + newProduct.quantity } // ✅ Correctly update quantity
            : item
        );
      } else {
        return [...prevCart, newProduct]; // ✅ Add new product with quantity
      }
    });
  };  

  // ✅ Remove product from cart
  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((product) => product.id !== id));
  };

  // ✅ Toggle Cart Drawer
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, toggleCart, isCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};

// ✅ Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

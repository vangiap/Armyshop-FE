import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem } from '../types';
import { CheckCircle } from 'lucide-react';

interface ShopContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  searchQuery: string;
  notification: string | null;
  addToCart: (product: Product, color?: string, size?: string) => void;
  removeFromCart: (id: number, color?: string, size?: string) => void;
  updateQuantity: (id: number, color: string | undefined, size: string | undefined, delta: number) => void;
  clearCart: () => void;
  toggleCart: (isOpen: boolean) => void;
  setSearchQuery: (query: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const addToCart = (product: Product, color?: string, size?: string) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => 
        item.id === product.id && 
        item.selectedColor === color && 
        item.selectedSize === size
      );

      if (existingItemIndex > -1) {
        const newItems = [...prev];
        newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + 1
        };
        return newItems;
      }
      
      return [...prev, { 
          ...product, 
          quantity: 1, 
          selectedColor: color, 
          selectedSize: size 
      }];
    });
    
    const attrInfo = [color, size].filter(Boolean).join(' - ');
    setNotification(`Đã thêm "${product.title}" ${attrInfo ? `(${attrInfo})` : ''} vào giỏ!`);
    setIsCartOpen(true);
    setTimeout(() => setNotification(null), 3000);
  };

  const removeFromCart = (id: number, color?: string, size?: string) => {
    setCartItems(prev => prev.filter(item => 
        !(item.id === id && item.selectedColor === color && item.selectedSize === size)
    ));
  };

  const updateQuantity = (id: number, color: string | undefined, size: string | undefined, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.selectedColor === color && item.selectedSize === size) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleCart = (isOpen: boolean) => {
    setIsCartOpen(isOpen);
  };

  return (
    <ShopContext.Provider value={{
      cartItems,
      isCartOpen,
      searchQuery,
      notification,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      setSearchQuery
    }}>
      {children}
      {notification && (
        <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:w-auto z-50 bg-gray-900/90 backdrop-blur text-white px-6 py-4 rounded-xl shadow-2xl flex items-center animate-bounce-in border border-gray-700/50">
          <CheckCircle className="h-6 w-6 text-green-400 mr-3 flex-shrink-0" />
          <span className="font-medium">{notification}</span>
        </div>
      )}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
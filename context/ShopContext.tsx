import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface Notification {
  message: string;
  type: 'success' | 'warning' | 'error';
}

interface ShopContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  searchQuery: string;
  notification: Notification | null;
  addToCart: (product: Product, color?: string, size?: string, attributes?: Record<string, string>, variant_id?: number) => void;
  removeFromCart: (id: number, color?: string, size?: string) => void;
  updateQuantity: (id: number, color: string | undefined, size: string | undefined, delta: number) => boolean;
  clearCart: () => void;
  toggleCart: (isOpen: boolean) => void;
  setSearchQuery: (query: string) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getItemStock: (item: CartItem) => number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Load cart from localStorage
const loadCartFromStorage = (): CartItem[] => {
  try {
    const saved = localStorage.getItem('cart_items');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem('cart_items', JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save cart:', e);
  }
};

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCartFromStorage);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<Notification | null>(null);

  // Helper function to get stock for an item
  const getItemStock = (item: CartItem): number => {
    // Check variant stock first
    if (item.variant_id && item.variants) {
      const variant = item.variants.find(v => v.id === item.variant_id);
      if (variant) return variant.stock;
    }
    // Fall back to product stock_quantity
    return item.stock_quantity ?? 999;
  };

  // Persist cart to localStorage
  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  const addToCart = (product: Product, color?: string, size?: string, attributes?: Record<string, string>, variant_id?: number) => {
    // Find variant_id and stock
    let variantId = variant_id;
    let availableStock = product.stock_quantity ?? 999;
    
    if (!variantId && product.variants && product.variants.length > 0) {
      // Helper to check if attribute is color type
      const isColorAttr = (name: string) => {
        const n = name.toLowerCase();
        return n.includes('color') || n.includes('màu');
      };
      // Helper to check if attribute is size type
      const isSizeAttr = (name: string) => {
        const n = name.toLowerCase();
        return n.includes('size') || n.includes('kích');
      };

      const matchingVariant = product.variants.find(v => {
        // Check color: variant must have color attribute matching selected color
        const colorMatch = !color || v.attributes.some(a => 
          isColorAttr(a.name) && a.value === color
        );
        
        // Check size: variant must have size attribute matching selected size  
        const sizeMatch = !size || v.attributes.some(a => 
          isSizeAttr(a.name) && a.value === size
        );
        
        // Check other attributes (e.g., Binh chủng)
        const otherAttrsMatch = !attributes || Object.keys(attributes).length === 0 || 
          Object.entries(attributes).every(([name, value]) =>
            v.attributes.some(a => a.name === name && a.value === value)
          );
        
        return colorMatch && sizeMatch && otherAttrsMatch;
      });
      
      variantId = matchingVariant?.id;
      if (matchingVariant) {
        availableStock = matchingVariant.stock;
      }
    }

    // Check if adding would exceed stock
    const attrKey = attributes ? JSON.stringify(attributes) : '';
    const existingItem = cartItems.find(item => 
      item.id === product.id && 
      item.selectedColor === color && 
      item.selectedSize === size &&
      JSON.stringify(item.selectedAttributes || {}) === attrKey
    );
    
    const currentQty = existingItem?.quantity || 0;
    if (currentQty + 1 > availableStock) {
      setNotification({
        message: `Không thể thêm! Chỉ còn ${availableStock} sản phẩm trong kho.`,
        type: 'warning'
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => 
        item.id === product.id && 
        item.selectedColor === color && 
        item.selectedSize === size &&
        JSON.stringify(item.selectedAttributes || {}) === attrKey
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
          selectedSize: size,
          selectedAttributes: attributes,
          variant_id: variantId
      }];
    });
    
    // Build notification with all attributes
    const attrParts = [color, size].filter(Boolean);
    if (attributes) {
      Object.values(attributes).forEach(v => attrParts.push(v));
    }
    const attrInfo = attrParts.join(' - ');
    setNotification({
      message: `Đã thêm "${product.title}" ${attrInfo ? `(${attrInfo})` : ''} vào giỏ!`,
      type: 'success'
    });
    setIsCartOpen(true);
    setTimeout(() => setNotification(null), 3000);
  };

  const removeFromCart = (id: number, color?: string, size?: string) => {
    setCartItems(prev => prev.filter(item => 
        !(item.id === id && item.selectedColor === color && item.selectedSize === size)
    ));
  };

  const updateQuantity = (id: number, color: string | undefined, size: string | undefined, delta: number): boolean => {
    const item = cartItems.find(item => 
      item.id === id && item.selectedColor === color && item.selectedSize === size
    );
    
    if (!item) return false;
    
    const newQty = item.quantity + delta;
    if (newQty < 1) return false;
    
    // Check stock limit when increasing
    if (delta > 0) {
      const stock = getItemStock(item);
      if (newQty > stock) {
        setNotification({
          message: `Không thể thêm! Chỉ còn ${stock} sản phẩm trong kho.`,
          type: 'warning'
        });
        setTimeout(() => setNotification(null), 3000);
        return false;
      }
    }
    
    setCartItems(prev => prev.map(cartItem => {
      if (cartItem.id === id && cartItem.selectedColor === color && cartItem.selectedSize === size) {
        return { ...cartItem, quantity: newQty };
      }
      return cartItem;
    }));
    return true;
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart_items');
  };

  const toggleCart = (isOpen: boolean) => {
    setIsCartOpen(isOpen);
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
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
      setSearchQuery,
      getCartTotal,
      getCartCount,
      getItemStock
    }}>
      {children}
      {notification && (
        <div className={`fixed bottom-4 left-4 right-4 sm:right-auto sm:w-auto z-50 backdrop-blur px-6 py-4 rounded-xl shadow-2xl flex items-center animate-bounce-in border ${
          notification.type === 'success' 
            ? 'bg-gray-900/90 border-gray-700/50 text-white' 
            : notification.type === 'warning'
            ? 'bg-amber-50 border-amber-200 text-amber-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-6 w-6 text-green-400 mr-3 flex-shrink-0" />
          ) : (
            <AlertTriangle className={`h-6 w-6 mr-3 flex-shrink-0 ${notification.type === 'warning' ? 'text-amber-500' : 'text-red-500'}`} />
          )}
          <span className="font-medium">{notification.message}</span>
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
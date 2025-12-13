import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const CartSidebar: React.FC = () => {
  const { cartItems, isCartOpen, toggleCart, updateQuantity, removeFromCart, getItemStock } = useShop();
  const navigate = useNavigate();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleCheckout = () => {
    toggleCart(false);
    navigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" onClick={() => toggleCart(false)} />
      
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700 bg-white shadow-2xl flex flex-col h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
              Giỏ hàng ({cartItems.length})
            </h2>
            <button onClick={() => toggleCart(false)} className="text-gray-400 hover:text-gray-500 hover:bg-gray-200 rounded-full p-1 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="bg-green-50 p-6 rounded-full mb-4">
                  <ShoppingBag className="h-12 w-12 text-primary opacity-50" />
                </div>
                <p className="text-gray-900 font-medium text-xl mb-2">Giỏ hàng trống</p>
                <p className="text-gray-500 text-sm mb-8">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
                <button 
                  onClick={() => toggleCart(false)}
                  className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
                >
                  Mua sắm ngay
                </button>
              </div>
            ) : (
              <ul className="space-y-6">
                {cartItems.map((item, index) => {
                   const itemKey = `${item.id}-${item.selectedColor || ''}-${item.selectedSize || ''}-${index}`;
                   
                   return (
                  <li key={itemKey} className="flex py-4 animate-in slide-in-from-right-4 duration-300">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3 className="line-clamp-2 mr-2"><a href="#">{item.title}</a></h3>
                          <p className="ml-4 whitespace-nowrap">{formatCurrency(item.price)}</p>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 capitalize">{item.category.replace(/-/g, ' ')}</p>
                        
                        <div className="mt-1 flex flex-wrap gap-2">
                            {item.selectedColor && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    Màu: {item.selectedColor}
                                </span>
                            )}
                            {item.selectedSize && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    Size: {item.selectedSize}
                                </span>
                            )}
                            {item.selectedAttributes && Object.entries(item.selectedAttributes).map(([name, value]) => (
                                <span key={name} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    {name}: {value}
                                </span>
                            ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-1 items-end justify-between text-sm mt-2">
                        <div className="flex flex-col">
                          <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
                            <button 
                              onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, -1)}
                              className="p-1 px-2 hover:bg-gray-50 text-gray-600 disabled:opacity-50 transition-colors rounded-l-md"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 font-medium text-gray-900 min-w-[2rem] text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, 1)}
                              className="p-1 px-2 hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-md"
                              disabled={item.quantity >= getItemStock(item)}
                              title={item.quantity >= getItemStock(item) ? 'Đã đạt giới hạn tồn kho' : ''}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          {/* Stock warning */}
                          {item.quantity >= getItemStock(item) && getItemStock(item) < 999 && (
                            <span className="text-xs text-amber-600 mt-1 flex items-center">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Tối đa {getItemStock(item)} sp
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}
                          className="font-medium text-red-500 hover:text-red-700 flex items-center transition-colors px-2 py-1 rounded hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </li>
                )})}
              </ul>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-6 sm:px-6 bg-gray-50">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>Tổng tạm tính</p>
                <p className="text-xl text-primary font-bold">{formatCurrency(total)}</p>
              </div>
              <p className="mt-0.5 text-xs text-gray-500 mb-6 italic">
                Phí vận chuyển sẽ được tính tại trang thanh toán.
              </p>
              <button
                className="w-full flex items-center justify-center rounded-lg border border-transparent bg-primary px-6 py-4 text-base font-bold text-white shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all transform active:scale-[0.98]"
                onClick={handleCheckout}
              >
                Tiến hành thanh toán
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
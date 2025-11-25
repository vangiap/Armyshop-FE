import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { ArrowLeft, CreditCard, Truck, CheckCircle, MapPin, User, Phone } from 'lucide-react';

interface CheckoutPageProps {
  cartItems: CartItem[];
  clearCart: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, clearCart }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    note: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 1000000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSuccess(true);
      clearCart();
    }, 1000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Đặt hàng thành công!</h2>
        <p className="text-gray-600 mb-8">
          Cảm ơn bạn đã mua sắm tại VietShop. Mã đơn hàng của bạn là <span className="font-mono font-bold text-gray-900">#VN{Math.floor(Math.random() * 10000)}</span>.
          Chúng tôi sẽ liên hệ với bạn sớm để xác nhận đơn hàng.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h2>
        <p className="text-gray-600 mb-8">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
        <button
          onClick={() => navigate('/')}
          className="text-primary hover:underline flex items-center justify-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-gray-500 hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Tiếp tục mua sắm
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Thông tin giao hàng
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm py-2.5 border"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm py-2.5 border"
                      placeholder="0912 xxx xxx"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email (Tùy chọn)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm py-2.5 px-3 border"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ nhận hàng</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="block w-full border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm py-2.5 px-3 border"
                  placeholder="Số nhà, đường, phường/xã..."
                />
              </div>

              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  id="note"
                  name="note"
                  rows={3}
                  value={formData.note}
                  onChange={handleInputChange}
                  className="block w-full border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm px-3 py-2 border"
                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-primary" />
              Phương thức thanh toán
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center p-4 border border-primary bg-green-50 rounded-lg cursor-pointer">
                <input 
                  id="cod" 
                  name="paymentMethod" 
                  type="radio" 
                  defaultChecked 
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300" 
                />
                <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-900">
                  Thanh toán khi nhận hàng (COD)
                </label>
                <Truck className="ml-auto h-5 w-5 text-gray-500" />
              </div>
              <div className="flex items-center p-4 border border-gray-200 rounded-lg opacity-60 cursor-not-allowed">
                <input 
                  id="banking" 
                  name="paymentMethod" 
                  type="radio" 
                  disabled 
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300" 
                />
                <label htmlFor="banking" className="ml-3 block text-sm font-medium text-gray-500">
                  Chuyển khoản ngân hàng (Đang bảo trì)
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Đơn hàng của bạn</h2>
            
            <ul className="divide-y divide-gray-200 mb-6 max-h-96 overflow-y-auto pr-2">
              {cartItems.map((item, idx) => (
                <li key={`${item.id}-${idx}`} className="py-4 flex">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover object-center" />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-sm font-medium text-gray-900">
                        <h3 className="line-clamp-2">{item.title}</h3>
                        <p className="ml-4">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                      <div className="flex gap-2 mt-1">
                        {item.selectedColor && <p className="text-xs text-gray-500 bg-gray-100 px-1.5 rounded">Màu: {item.selectedColor}</p>}
                        {item.selectedSize && <p className="text-xs text-gray-500 bg-gray-100 px-1.5 rounded">Size: {item.selectedSize}</p>}
                      </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">SL: {item.quantity}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <p>Tạm tính</p>
                <p>{formatCurrency(subtotal)}</p>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <p>Phí vận chuyển</p>
                <p>{shippingFee === 0 ? <span className="text-green-600 font-medium">Miễn phí</span> : formatCurrency(shippingFee)}</p>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                <p>Tổng cộng</p>
                <p className="text-xl text-primary">{formatCurrency(total)}</p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full mt-6 bg-primary border border-transparent rounded-lg shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
            >
              Đặt hàng ({formatCurrency(total)})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;